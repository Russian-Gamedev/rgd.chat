<script lang="ts">
import { goto, invalidate } from '$app/navigation';
import { page } from '$app/state';
import { ApiHttpError, createApi } from '$lib/api/api';
import type { ProjectDetails, ProjectEditor } from '$lib/api/api.type';
import { requireAuth } from '$lib/auth/auth.actions';
import { hasGlobalPermission } from '$lib/auth/permissions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import UserIdentity from '$lib/components/UserIdentity.svelte';
import ProjectRevisionComparison from '$lib/projects/ProjectRevisionComparison.svelte';
import ProjectRevisionPreview from '$lib/projects/ProjectRevisionPreview.svelte';
import ReviewTimeline from '$lib/projects/ReviewTimeline.svelte';
import { isPositiveDiscordId, validReviewComment } from '$lib/projects/review-utils';

import type { PageProps } from './$types';

let { data }: PageProps = $props();
requireAuth(page.data.auth);
const api = createApi({ fetch });
const canReview = $derived(hasGlobalPermission(page.data.auth, 'projects:review'));
let project = $state<ProjectEditor | null>(null);
let published = $state<ProjectDetails | null>(null);
let dialog = $state<'publish' | 'changes' | 'owner' | 'delete' | null>(null);
let comment = $state('');
let ownerId = $state('');
let deleteConfirmation = $state('');
let isMutating = $state(false);
let loadError = $state(false);

$effect(() => {
	project = data.project;
	published = data.published;
	loadError = !data.project;
});

async function invalidateProjects() {
	await Promise.all([
		invalidate('projects:review'),
		invalidate(`projects:review:${project?.id}`),
		invalidate('projects:public-list'),
		invalidate(`projects:details:${project?.slug ?? page.params.id}`),
		invalidate(`projects:details:${project?.id ?? page.params.id}`),
		invalidate('projects:tags'),
		invalidate('projects:mine'),
		project?.credits.owner_id
			? invalidate(`users:${project.credits.owner_id}:projects`)
			: Promise.resolve()
	]);
}

async function reload() {
	await invalidate(`projects:review:${project?.id ?? page.params.id}`);
	location.reload();
}

function errorMessage(error: unknown) {
	if (!(error instanceof ApiHttpError)) return 'Сетевая ошибка.';
	if (error.status === 403) return 'Permission projects:review больше недоступен.';
	if (error.status === 404) return 'Проект удалён или больше недоступен.';
	if (error.status === 409) return 'Состояние редакции уже изменил другой модератор.';
	if (error.status === 400) return 'Backend отклонил данные. Проверьте поля.';
	return `Операция не выполнена (${error.status}).`;
}

async function mutate(action: 'publish' | 'changes' | 'owner' | 'delete') {
	if (!project || isMutating) return;
	if (action === 'changes' && !validReviewComment(comment)) return;
	if (action === 'owner' && !isPositiveDiscordId(ownerId)) return;
	if (action === 'delete' && deleteConfirmation !== project.title) return;
	isMutating = true;
	try {
		if (action === 'publish') await api.publishReview(project.id, comment.trim() || undefined);
		if (action === 'changes') await api.requestChanges(project.id, comment.trim());
		if (action === 'owner') await api.transferOwner(project.id, ownerId.trim());
		if (action === 'delete') await api.deleteProject(project.id);
		await invalidateProjects();
		dialog = null;
		comment = '';
		ownerId = '';
		deleteConfirmation = '';
		if (action === 'delete') {
			showSnackbar({ message: 'Проект удалён.', variant: 'success' });
			await goto('/admin/projects');
			return;
		}
		showSnackbar({
			message:
				action === 'publish'
					? 'Проект опубликован.'
					: action === 'changes'
						? 'Проект возвращён на доработку.'
						: 'Владелец изменён.',
			variant: 'success'
		});
		await reload();
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 409) {
			dialog = null;
			await reload();
		}
		showSnackbar({ message: errorMessage(error), variant: 'error', duration: 7000 });
	} finally {
		isMutating = false;
	}
}

function openOwner() {
	ownerId = project?.credits.owner_id ?? '';
	dialog = 'owner';
}
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Модерация', href: '/admin/projects' }, { label: project?.title ?? 'Проект', href: '' }]} />

{#if !canReview}<section class="state"><h1>403</h1><p>Для модерации требуется permission projects:review.</p></section>
{:else if loadError}<section class="state"><h1>Проект недоступен</h1><p>Проект удалён или не удалось загрузить редакцию.</p><Button as="a" href="/admin/projects">Вернуться в очередь</Button></section>
{:else if project}
	<div class="page-header"><div><h1>{project.title}</h1><p class="status">ID: {project.id} · Версия v{project.workflow.version} · Статус: {project.workflow.status}</p><div class="owner-line">Владелец: <UserIdentity id={project.credits.owner_id} /></div><p class="status">Изменено: {new Date(project.metadata.updated_at).toLocaleString('ru-RU')}</p>{#if project.workflow.submitted_at}<p class="status">Отправлено на ревью: {new Date(project.workflow.submitted_at).toLocaleString('ru-RU')}</p>{/if}</div>{#if project.workflow.has_published_version}<Button as="a" href={`/projects/${project.slug}`} variant="outline">Публичная версия</Button>{/if}</div>
	<section><h2>Рабочая редакция</h2><ProjectRevisionPreview {project} /></section>
	{#if project.workflow.has_published_version}<section class="comparison-section"><h2>Сравнение с опубликованной версией v{project.workflow.published_version}</h2><ProjectRevisionComparison working={project} {published} /></section>{/if}
	<ReviewTimeline events={project.workflow.review_events} />
	<section class="decision-panel"><h2>Решение модератора</h2><p>Комментарий будет сохранён в истории ревью. Для возврата на доработку он обязателен.</p><textarea bind:value={comment} maxlength="2000" rows="6" placeholder="Комментарий модератора"></textarea><div class="decision-actions"><Button disabled={isMutating || project.workflow.status !== 'review'} onclick={() => (dialog = 'publish')}>Опубликовать</Button><Button variant="outline" color="error" disabled={isMutating || project.workflow.status !== 'review' || !validReviewComment(comment)} onclick={() => (dialog = 'changes')}>Вернуть на доработку</Button></div><div class="secondary-actions"><Button variant="ghost" disabled={isMutating} onclick={openOwner}>Сменить владельца</Button><Button variant="ghost" color="error" disabled={isMutating} onclick={() => (dialog = 'delete')}>Удалить проект</Button></div></section>

	<Modal open={dialog === 'publish'} title="Опубликовать редакцию" onClose={() => (dialog = null)}><p>Версия v{project.workflow.version} станет публичной.</p><div class="modal-actions"><Button disabled={isMutating} onclick={() => mutate('publish')}>Подтвердить публикацию</Button></div></Modal>
	<Modal open={dialog === 'changes'} title="Вернуть на доработку" onClose={() => (dialog = null)}><p>Автор снова получит доступ к редактированию проекта.</p><p>Комментарий берётся из блока решения внизу страницы.</p><div class="modal-actions"><Button color="error" disabled={isMutating || !validReviewComment(comment)} onclick={() => mutate('changes')}>Вернуть</Button></div></Modal>
	<Modal open={dialog === 'owner'} title="Сменить владельца" onClose={() => (dialog = null)}><p>Текущий владелец: {project.credits.owner_id}</p><label>Новый Discord ID<input bind:value={ownerId} inputmode="numeric" /></label><p class="warning">После смены владельца предыдущий владелец потеряет доступ к редактированию этого проекта.</p><div class="modal-actions"><Button disabled={isMutating || !isPositiveDiscordId(ownerId)} onclick={() => mutate('owner')}>Сменить владельца</Button></div></Modal>
	<Modal open={dialog === 'delete'} title="Удалить проект" onClose={() => (dialog = null)}><p>Публичная страница, история и лайки будут удалены без возможности восстановления.</p><label>Введите название проекта: <strong>{project.title}</strong><input bind:value={deleteConfirmation} /></label><div class="modal-actions"><Button color="error" disabled={isMutating || deleteConfirmation !== project.title} onclick={() => mutate('delete')}>Удалить навсегда</Button></div></Modal>
{/if}

<style>
	.page-header { align-items: center; display: flex; justify-content: space-between; margin: 1.5rem 0; } h1, h2, p { margin-top: 0; } .status { color: var(--color-text-secondary); margin-bottom: .35rem; } .owner-line { align-items: center; display: flex; gap: .35rem; margin: .5rem 0; } .modal-actions, .decision-actions, .secondary-actions { display: flex; flex-wrap: wrap; gap: .5rem; } section { margin: 1.5rem 0; } .comparison-section, .decision-panel { background: var(--color-bg-surface); border-radius: .65rem; padding: 1rem; } .decision-panel textarea { margin: .75rem 0; } .secondary-actions { border-top: 1px solid #303238; margin-top: 1rem; padding-top: 1rem; } label { display: grid; gap: .35rem; margin: 1rem 0; } input, textarea { background: var(--color-bg-surface); border: 1px solid #303238; border-radius: .4rem; color: inherit; font: inherit; padding: .6rem; width: 100%; } .warning { color: var(--color-warning); } .state { background: var(--color-bg-surface); border-radius: .65rem; padding: 2rem; text-align: center; } @media (max-width: 800px) { .page-header { align-items: flex-start; flex-direction: column; gap: 1rem; } }
</style>
