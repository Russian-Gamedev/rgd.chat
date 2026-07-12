<script lang="ts">
import { onMount } from 'svelte';

import { beforeNavigate, goto, invalidate } from '$app/navigation';
import { page } from '$app/state';
import { ApiHttpError, createApi } from '$lib/api/api';
import type { GameEditorDto, GameGenreDto } from '$lib/api/api.type';
import { requireAuth } from '$lib/auth/auth.actions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import { showSnackbar } from '$lib/components/snackbar';

import GameEditorForm from './GameEditorForm.svelte';
import type { GameFormErrors } from './game-editor';
import {
	editorToForm,
	emptyGameForm,
	formSnapshot,
	formToPayload,
	hasErrors,
	validateGameForm
} from './game-editor';
import ReviewTimeline from './ReviewTimeline.svelte';

let { gameId = null }: { gameId?: string | null } = $props();

requireAuth(page.data.auth);

const api = createApi({ fetch });
let editor = $state<GameEditorDto | null>(null);
let genres = $state<GameGenreDto[]>([]);
let form = $state(emptyGameForm());
let savedSnapshot = $state(formSnapshot(emptyGameForm()));
let errors = $state<GameFormErrors>({});
let loadState = $state<'loading' | 'ready' | 'not-found' | 'forbidden' | 'error'>('loading');
let isMutating = $state(false);
let conflict = $state(false);

const isReview = $derived(editor?.status === 'review');
const isDirty = $derived(loadState === 'ready' && formSnapshot(form) !== savedSnapshot);
const canDelete = $derived(Boolean(editor && !editor.has_published_version));
const latestChangesRequest = $derived(
	[...(editor?.review_events ?? [])]
		.filter((event) => event.action === 'changes_requested')
		.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]
);
const submittedAt = $derived(
	editor?.submitted_at ??
		[...(editor?.review_events ?? [])]
			.filter((event) => event.action === 'submitted')
			.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]?.created_at ??
		null
);

function applyEditor(next: GameEditorDto) {
	editor = next;
	form = editorToForm(next);
	savedSnapshot = formSnapshot(form);
	errors = {};
	conflict = false;
}

function errorMessage(error: unknown): string {
	if (!(error instanceof ApiHttpError)) return 'Сетевая ошибка. Повторите попытку.';
	if (error.status === 400) return 'Backend отклонил данные формы. Проверьте заполнение полей.';
	if (error.status === 401) return 'Для этого действия требуется войти.';
	if (error.status === 403) return 'У вас нет доступа к этой игре.';
	if (error.status === 404) return 'Игра не найдена.';
	if (error.status === 409)
		return 'Состояние игры изменилось на сервере. Загрузите актуальную редакцию.';
	return `Ошибка сервера (${error.status}).`;
}

async function loadEditor(options?: { replaceDirty?: boolean }) {
	if (!gameId) return;
	if (
		isDirty &&
		!options?.replaceDirty &&
		!confirm('Локальные изменения будут потеряны. Продолжить?')
	) {
		return;
	}

	loadState = 'loading';
	try {
		applyEditor(await api.getGameEditor(gameId));
		loadState = 'ready';
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 404) loadState = 'not-found';
		else if (error instanceof ApiHttpError && error.status === 403) loadState = 'forbidden';
		else loadState = 'error';
	}
}

async function saveDraft(forReview = false): Promise<boolean> {
	if (isMutating || isReview) return false;

	errors = validateGameForm(form, forReview);
	if (hasErrors(errors)) {
		showSnackbar({ message: 'Исправьте ошибки формы.', variant: 'error' });
		return false;
	}

	if (gameId && !isDirty) return true;

	isMutating = true;
	try {
		const next = gameId
			? await api.updateGameDraft(gameId, formToPayload(form))
			: await api.createGameDraft(formToPayload(form));
		applyEditor(next);
		await Promise.all([
			invalidate('games:mine'),
			gameId ? invalidate(`games:editor:${gameId}`) : Promise.resolve()
		]);
		showSnackbar({ message: 'Черновик сохранён.', variant: 'success' });

		if (!gameId) {
			gameId = next.id;
			if (!forReview) await goto(`/games/editor/${next.id}`, { replaceState: true });
		}
		return true;
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 409) conflict = true;
		showSnackbar({ message: errorMessage(error), variant: 'error', duration: 7000 });
		return false;
	} finally {
		isMutating = false;
	}
}

async function submitReview() {
	if (isMutating || isReview) return;
	const wasNew = !gameId;
	if (!(await saveDraft(true)) || !gameId) return;

	isMutating = true;
	try {
		applyEditor(await api.submitForReview(gameId));
		await Promise.all([invalidate('games:mine'), invalidate(`games:editor:${gameId}`)]);
		showSnackbar({ message: 'Редакция отправлена на ревью.', variant: 'success' });
		if (wasNew) await goto(`/games/editor/${gameId}`, { replaceState: true });
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 409) conflict = true;
		showSnackbar({ message: errorMessage(error), variant: 'error', duration: 7000 });
	} finally {
		isMutating = false;
	}
}

async function deleteGame() {
	if (!gameId || !canDelete || isMutating) return;
	if (!confirm('Удалить неопубликованный проект без возможности восстановления?')) return;

	isMutating = true;
	try {
		await api.deleteGame(gameId);
		await Promise.all([
			invalidate('games:mine'),
			invalidate('games:list'),
			invalidate(`games:${gameId}`),
			invalidate('user:games')
		]);
		showSnackbar({ message: 'Проект удалён.', variant: 'success' });
		await goto('/games/mine');
	} catch (error) {
		showSnackbar({ message: errorMessage(error), variant: 'error', duration: 7000 });
	} finally {
		isMutating = false;
	}
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

	if (!gameId) loadState = 'ready';

	Promise.all([
		api
			.listGenres()
			.then((value) => (genres = value))
			.catch(() => showSnackbar({ message: 'Не удалось загрузить жанры.', variant: 'error' })),
		gameId ? loadEditor({ replaceDirty: true }) : Promise.resolve()
	]);

	return () => window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<Breadcrumb
  items={[
    { label: 'Главная', href: '/' },
    { label: 'Игры', href: '/games' },
    { label: 'Мои проекты', href: '/games/mine' },
    { label: gameId ? 'Редактор' : 'Новая игра', href: '' }
  ]}
/>

<div class="page-header">
  <div>
    <h1>{gameId ? 'Редактор игры' : 'Новая игра'}</h1>
    {#if editor}
      <p class="status">Версия {editor.version} · {editor.status}</p>
    {/if}
  </div>
  {#if editor?.has_published_version}
    <Button as="a" href={`/games/${editor.id}`} variant="outline">Публичная версия</Button>
  {/if}
</div>

{#if loadState === 'loading'}
  <p>Загрузка редактора…</p>
{:else if loadState === 'not-found'}
  <section class="state"><h2>Игра не найдена</h2><p>Редактор для указанной игры недоступен.</p></section>
{:else if loadState === 'forbidden'}
  <section class="state"><h2>Нет доступа</h2><p>Редактировать эту игру может только её владелец.</p></section>
{:else if loadState === 'error'}
  <section class="state"><h2>Не удалось загрузить редактор</h2><Button type="button" onclick={() => loadEditor()}>Повторить</Button></section>
{:else}
  {#if isReview}
    <section class="notice review-notice">
      <strong>Редакция находится на ревью.</strong>
      <p>Редактирование заблокировано до решения ревьюера{#if submittedAt} с {new Date(submittedAt).toLocaleString('ru-RU')}{/if}.</p>
    </section>
  {:else if latestChangesRequest}
    <section class="notice changes-notice">
      <strong>Ревьюер запросил изменения</strong>
      <p>{latestChangesRequest.comment ?? 'Комментарий не указан.'}</p>
    </section>
  {:else if editor?.status === 'published'}
    <section class="notice">
      <strong>Версия опубликована.</strong>
      <p>Измените данные и сохраните: backend создаст новую черновую редакцию.</p>
    </section>
  {/if}

  {#if conflict}
    <section class="notice conflict-notice">
      <strong>Конфликт состояния</strong>
      <p>Локальные данные не перезаписаны. Загрузите актуальную редакцию с сервера.</p>
      <Button type="button" variant="outline" onclick={() => loadEditor()}>Перезагрузить редакцию</Button>
    </section>
  {/if}

  <GameEditorForm bind:form {genres} {errors} readonly={isReview} />

  <div class="actions">
    {#if !isReview}
      <Button type="button" disabled={isMutating || (!isDirty && Boolean(gameId))} onclick={() => saveDraft()}>
        {isMutating ? 'Сохранение…' : isDirty || !gameId ? 'Сохранить черновик' : 'Сохранено'}
      </Button>
      <Button type="button" variant="outline" disabled={isMutating} onclick={submitReview}>Отправить на ревью</Button>
    {/if}
    {#if canDelete}
      <Button type="button" color="error" variant="outline" disabled={isMutating} onclick={deleteGame}>Удалить проект</Button>
    {/if}
    {#if isDirty}<span class="dirty">Есть несохранённые изменения</span>{/if}
  </div>

  {#if editor}<ReviewTimeline events={editor.review_events} />{/if}
{/if}

<style>
  :global(main) {
    overflow-x: hidden;
  }

  .page-header,
  .actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .page-header {
    justify-content: space-between;
    margin: 1.5rem 0;
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

  .actions {
    border-top: 1px solid #303238;
    margin-top: 2rem;
    padding-top: 1rem;
  }
</style>
