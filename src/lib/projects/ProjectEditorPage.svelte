<script lang="ts">
import { onMount } from 'svelte';

import { beforeNavigate, goto, invalidate } from '$app/navigation';
import { page } from '$app/state';
import { ApiHttpError, createApi } from '$lib/api/api';
import type { ProjectEditor, ProjectPopularTag, ProjectPublicTag } from '$lib/api/api.type';
import bannerImage from '$lib/assets/backgrounds/banner-1.webp';
import { requireAuth } from '$lib/auth/auth.actions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Stepper from '$lib/components/Stepper.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import UserIdentity from '$lib/components/UserIdentity.svelte';

import ProjectEditorForm from './ProjectEditorForm.svelte';
import ProjectPreviewCard from './ProjectPreviewCard.svelte';
import type { ProjectFormErrors, ProjectSavedMedia } from './project-editor';
import {
	EDITOR_STEPS,
	editorToForm,
	emptyProjectForm,
	errorSteps,
	formSnapshot,
	formToPayload,
	formToUpdatePayload,
	hasErrors,
	validateProjectForm,
	validateStep
} from './project-editor';
import ReviewTimeline from './ReviewTimeline.svelte';

let { projectId = null }: { projectId?: string | null } = $props();

requireAuth(page.data.auth);

const api = createApi({ fetch });
const lastStep = EDITOR_STEPS.length - 1;
let editor = $state<ProjectEditor | null>(null);
let tagOptions = $state<ProjectPublicTag[]>([]);
let tagsLoadFailed = $state(false);
let popularTags = $state<ProjectPopularTag[]>([]);
let form = $state(emptyProjectForm());
let savedSnapshot = $state(formSnapshot(emptyProjectForm()));
let errors = $state<ProjectFormErrors>({});
let loadState = $state<'loading' | 'ready' | 'not-found' | 'forbidden' | 'error'>('loading');
let isMutating = $state(false);
let conflict = $state(false);
let savedMedia = $state<ProjectSavedMedia>({ attachments: [], banner: null });
let step = $state(0);
let maxStep = $state(0);
let stepErrorList = $state<number[]>([]);

const isReview = $derived(editor?.workflow.status === 'review');
const isDirty = $derived(loadState === 'ready' && formSnapshot(form) !== savedSnapshot);
const canDelete = $derived(Boolean(editor && !editor.workflow.has_published_version));
const latestChangesRequest = $derived(
	[...(editor?.workflow.review_events ?? [])]
		.filter((event) => event.action === 'changes_requested')
		.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]
);
const submittedAt = $derived(
	editor?.workflow.submitted_at ??
		[...(editor?.workflow.review_events ?? [])]
			.filter((event) => event.action === 'submitted')
			.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]?.created_at ??
		null
);

function scrollTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function advance() {
	step = Math.min(step + 1, lastStep);
	maxStep = Math.max(maxStep, step);
	stepErrorList = [];
	scrollTop();
}

function applyEditor(next: ProjectEditor) {
	editor = next;
	form = editorToForm(next);
	savedMedia = {
		attachments: next.resources.attachments.map((attachment) => ({ ...attachment })),
		banner: form.banner ? { ...form.banner } : null
	};
	savedSnapshot = formSnapshot(form);
	errors = {};
	conflict = false;
}

function errorMessage(error: unknown): string {
	if (!(error instanceof ApiHttpError)) return 'Сетевая ошибка. Повторите попытку.';
	if (error.status === 400) return 'Backend отклонил данные формы. Проверьте заполнение полей.';
	if (error.status === 401) return 'Для этого действия требуется войти.';
	if (error.status === 403) return 'У вас нет доступа к этому проекту.';
	if (error.status === 404) return 'Проект не найден.';
	if (error.status === 409) {
		const message = (error.details as { message?: string } | undefined)?.message;
		if (message === 'Project slug is already in use.') return 'Этот адрес уже занят.';
		return 'Состояние проекта изменилось на сервере. Загрузите актуальную редакцию.';
	}
	return `Ошибка сервера (${error.status}).`;
}

async function loadEditor(options?: { replaceDirty?: boolean }) {
	if (!projectId) return;
	if (
		isDirty &&
		!options?.replaceDirty &&
		!confirm('Локальные изменения будут потеряны. Продолжить?')
	) {
		return;
	}

	loadState = 'loading';
	try {
		applyEditor(await api.getProjectEditor(projectId));
		loadState = 'ready';
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 404) loadState = 'not-found';
		else if (error instanceof ApiHttpError && error.status === 403) loadState = 'forbidden';
		else loadState = 'error';
	}
}

/** Сохраняет черновик без валидации — валидация происходит в обработчиках шагов. */
async function saveDraft(): Promise<boolean> {
	if (isMutating || isReview) return false;
	if (projectId && !isDirty) return true;

	isMutating = true;
	try {
		const previousSlug = editor?.slug;
		const next = projectId
			? await api.updateProjectDraft(projectId, formToUpdatePayload(form, savedMedia))
			: await api.createProjectDraft(formToPayload(form));
		applyEditor(next);
		await Promise.all([
			invalidate('projects:mine'),
			invalidate('projects:public-list'),
			invalidate('projects:tags'),
			invalidate(`projects:details:${next.slug}`),
			invalidate(`projects:details:${next.id}`),
			invalidate(`users:${next.credits.owner_id}:projects`),
			previousSlug && previousSlug !== next.slug
				? invalidate(`projects:details:${previousSlug}`)
				: Promise.resolve(),
			projectId ? invalidate(`projects:editor:${projectId}`) : Promise.resolve()
		]);
		showSnackbar({ message: 'Черновик сохранён.', variant: 'success' });

		if (!projectId) {
			projectId = next.id;
			await goto(`/projects/editor/${next.id}`, { replaceState: true });
		}
		return true;
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 409) conflict = true;
		showSnackbar({
			message: errorMessage(error),
			variant: 'error',
			duration: 7000
		});
		return false;
	} finally {
		isMutating = false;
	}
}

/** «Далее»: валидирует текущий шаг, сохраняет его и переходит к следующему. */
async function goNext() {
	if (isMutating) return;
	stepErrorList = [];
	if (!isReview) {
		errors = validateStep(form, step, false);
		if (hasErrors(errors)) {
			scrollTop();
			return;
		}
		if (!(await saveDraft())) return;
	}
	advance();
}

function goBack() {
	if (step === 0 || isMutating) return;
	step -= 1;
	errors = {};
	stepErrorList = [];
	scrollTop();
}

function selectStep(index: number) {
	if (index > maxStep || index === step || isMutating) return;
	step = index;
	errors = {};
	stepErrorList = [];
	scrollTop();
}

/** Финал: полная валидация, сохранение и отправка на модерацию. */
async function submitForModeration() {
	if (isMutating || isReview) return;
	errors = validateProjectForm(form, true);
	stepErrorList = errorSteps(errors);
	if (hasErrors(errors)) {
		const firstErrorStep = stepErrorList[0];
		if (firstErrorStep !== undefined && firstErrorStep > maxStep) maxStep = firstErrorStep;
		if (firstErrorStep !== undefined) step = firstErrorStep;
		showSnackbar({
			message: 'Проверьте шаги, отмеченные ошибками.',
			variant: 'error'
		});
		scrollTop();
		return;
	}
	if (!(await saveDraft()) || !projectId) return;

	isMutating = true;
	try {
		applyEditor(await api.submitForReview(projectId));
		await Promise.all([
			invalidate('projects:mine'),
			invalidate('projects:public-list'),
			invalidate('projects:tags'),
			invalidate(`projects:details:${editor?.slug ?? projectId}`),
			invalidate(`projects:details:${projectId}`),
			invalidate(`users:${editor?.credits.owner_id ?? ''}:projects`),
			invalidate(`projects:editor:${projectId}`)
		]);
		showSnackbar({
			message: 'Проект отправлен на модерацию.',
			variant: 'success'
		});
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 409) conflict = true;
		showSnackbar({
			message: errorMessage(error),
			variant: 'error',
			duration: 7000
		});
	} finally {
		isMutating = false;
	}
}

async function saveDraftAction() {
	stepErrorList = [];
	errors = validateStep(form, step, false);
	if (hasErrors(errors)) {
		scrollTop();
		return;
	}
	await saveDraft();
}

async function deleteProject() {
	if (!projectId || !canDelete || isMutating) return;
	if (!confirm('Удалить неопубликованный проект без возможности восстановления?')) return;

	isMutating = true;
	try {
		await api.deleteProject(projectId);
		await Promise.all([
			invalidate('projects:mine'),
			invalidate('projects:public-list'),
			invalidate(`projects:details:${projectId}`),
			invalidate('projects:tags')
		]);
		showSnackbar({ message: 'Проект удалён.', variant: 'success' });
		await goto('/projects/mine');
	} catch (error) {
		showSnackbar({
			message: errorMessage(error),
			variant: 'error',
			duration: 7000
		});
	} finally {
		isMutating = false;
	}
}

function cancel() {
	void goto('/projects/mine');
}

beforeNavigate((navigation) => {
	if (isDirty && !confirm('Есть несохранённые изменения. Покинуть страницу?')) navigation.cancel();
});

onMount(() => {
	const handleBeforeUnload = (event: BeforeUnloadEvent) => {
		if (!isDirty) return;
		event.preventDefault();
		event.returnValue = '';
	};
	window.addEventListener('beforeunload', handleBeforeUnload);

	if (!projectId) loadState = 'ready';

	Promise.all([
		api
			.listTags()
			.then((value) => {
				tagOptions = value;
				tagsLoadFailed = false;
			})
			.catch(() => {
				tagsLoadFailed = true;
				showSnackbar({
					message: 'Не удалось загрузить теги.',
					variant: 'error'
				});
			}),
		api
			.listPopularTags()
			.then((value) => (popularTags = value))
			.catch(() => (popularTags = [])),
		projectId ? loadEditor({ replaceDirty: true }) : Promise.resolve()
	]);

	return () => window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<section
  class="page-banner"
  style:background-image={`linear-gradient(90deg, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg) 72%, transparent) 42%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0) 55%, var(--color-bg) 100%), url(${bannerImage})`}
>
  <Breadcrumb
    items={[
      { label: "Главная", href: "/" },
      { label: "Проекты", href: "/projects" },
      { label: projectId ? "Редактор" : "Создание проекта", href: "" }
    ]}
  />

  <div class="page-header">
    <div>
      <h1>{projectId ? "Редактор проекта" : "Создание проекта"}</h1>
      {#if projectId}
        {#if editor}
          <p class="status">Версия {editor.workflow.version} · {editor.workflow.status}</p>
          {#if editor.credits.owner_id}
            <UserIdentity id={editor.credits.owner_id} compact />
          {/if}
        {/if}
      {:else}
        <p class="status">Заполните основные данные и отправьте проект на модерацию</p>
      {/if}
    </div>
    {#if editor?.workflow.has_published_version}
      <Button as="a" href={`/projects/${editor.slug}`} variant="outline"
        >Публичная версия</Button
      >
    {/if}
  </div>

  {#if loadState === "ready"}
    <Stepper
      steps={EDITOR_STEPS}
      current={step}
      maxReached={maxStep}
      errorSteps={stepErrorList}
      onSelect={selectStep}
    />
    <p class="step-description">{EDITOR_STEPS[step].description}</p>
  {/if}
</section>

{#if loadState === "loading"}
  <p>Загрузка редактора…</p>
{:else if loadState === "not-found"}
  <section class="state">
    <h2>Проект не найден</h2>
    <p>Редактор для указанного проекта недоступен.</p>
  </section>
{:else if loadState === "forbidden"}
  <section class="state">
    <h2>Нет доступа</h2>
    <p>Редактировать этот проект может только его владелец.</p>
  </section>
{:else if loadState === "error"}
  <section class="state">
    <h2>Не удалось загрузить редактор</h2>
    <Button type="button" onclick={() => loadEditor()}>Повторить</Button>
  </section>
{:else}
  {#if isReview}
    <section class="notice review-notice">
      <strong>Редакция находится на ревью.</strong>
      <p>
        Редактирование заблокировано до решения модератора {#if submittedAt}
          с {new Date(submittedAt).toLocaleString("ru-RU")}{/if}.
      </p>
    </section>
  {:else if latestChangesRequest}
    <section class="notice changes-notice">
      <strong>Ревьюер запросил изменения</strong>
      <p>{latestChangesRequest.comment ?? "Комментарий не указан."}</p>
    </section>
  {:else if editor?.workflow.status === "published"}
    <section class="notice">
      <strong>Версия опубликована.</strong>
      <p>
        Измените данные и сохраните: backend создаст новую черновую редакцию.
      </p>
    </section>
  {/if}

  {#if conflict}
    <section class="notice conflict-notice">
      <strong>Конфликт состояния</strong>
      <p>
        Локальные данные не перезаписаны. Загрузите актуальную редакцию с
        сервера.
      </p>
      <Button type="button" variant="outline" onclick={() => loadEditor()}
        >Перезагрузить редакцию</Button
      >
    </section>
  {/if}

  <div class="wizard-grid">
    <div class="wizard-form">
      <ProjectEditorForm bind:form {step} {tagOptions} {errors} readonly={isReview} />
      {#if isDirty}<span class="dirty">Есть несохранённые изменения</span>{/if}
    </div>
    <aside class="preview-col">
      <ProjectPreviewCard {form} />
    </aside>
  </div>

  <div class="wizard-footer">
    <Button type="button" variant="outline" disabled={isMutating} onclick={cancel}>
      Отмена
    </Button>
    <div class="footer-right">
      {#if !isReview && canDelete}
        <Button
          type="button"
          color="error"
          variant="ghost"
          disabled={isMutating}
          onclick={deleteProject}>Удалить</Button
        >
      {/if}
      <Button
        type="button"
        variant="outline"
        disabled={step === 0 || isMutating}
        onclick={goBack}>Назад</Button
      >
      {#if step < lastStep}
        <Button type="button" disabled={isMutating} onclick={goNext}>
          {isMutating ? "Сохранение…" : "Далее"}
        </Button>
      {:else if !isReview}
        <Button
          type="button"
          variant="outline"
          disabled={isMutating}
          onclick={saveDraftAction}>Сохранить черновик</Button
        >
        <Button type="button" disabled={isMutating} onclick={submitForModeration}>
          {isMutating ? "Отправка…" : "Отправить на модерацию"}
        </Button>
      {/if}
    </div>
  </div>

  {#if editor}<ReviewTimeline events={editor.workflow.review_events} />{/if}
{/if}

<style>
  :global(main) {
    overflow-x: hidden;
  }

  .page-header,
  .wizard-footer,
  .footer-right {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .page-banner {
    background-color: var(--color-bg);
    background-position: left top, center bottom, right center;
    background-repeat: no-repeat;
    background-size: auto, 100% 100%, cover;
    margin: -64px -40px 1.5rem;
    padding: 64px 40px 1.75rem;
  }

  .page-banner :global(a) {
    color: var(--color-text-secondary);
  }

  .page-banner h1 {
    font-size: 2.25rem;
    margin: 1rem 0 0.5rem;
  }

  .page-header {
    justify-content: space-between;
    margin: 0 0 1.75rem;
  }

  h1,
  .status {
    margin: 0;
  }

  .status,
  .dirty {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  .step-description {
    color: var(--color-text-secondary);
    margin: 0 0 1.5rem;
  }

  .wizard-grid {
    display: grid;
    align-items: start;
    gap: 1.5rem;
    grid-template-columns: minmax(0, 1fr) 18rem;
  }

  .preview-col {
    position: sticky;
    top: 1rem;
  }

  .wizard-footer {
    border-top: 1px solid #303238;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1rem;
  }

  .footer-right {
    margin-left: auto;
  }

  .notice,
  .state {
    background: var(--color-bg-surface);
    border-left: 4px solid var(--color-primary);
    border-radius: 0.5rem;
    margin: 0 0 1.5rem;
    padding: 1rem;
  }

  .notice p,
  .state p {
    margin: 0.45rem 0 0;
    white-space: pre-wrap;
  }

  .review-notice {
    border-color: var(--color-warning);
  }

  .changes-notice,
  .conflict-notice {
    border-color: var(--color-error);
  }

  .conflict-notice :global(.button) {
    margin-top: 0.75rem;
  }

  @media (max-width: 900px) {
    .wizard-grid {
      grid-template-columns: 1fr;
    }

    .preview-col {
      order: -1;
      position: static;
    }

    .page-banner {
      margin: -24px -16px 1.25rem;
      padding: 24px 16px 1.25rem;
    }

    .page-banner h1 {
      font-size: 1.5rem;
    }
  }
</style>
