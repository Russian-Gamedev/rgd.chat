<script lang="ts">
import { goto, invalidate } from '$app/navigation';
import { page } from '$app/state';
import { ApiHttpError, createApi } from '$lib/api/api';
import type { GameDetailsDto, GameEditorDto } from '$lib/api/api.type';
import { requireAuth } from '$lib/auth/auth.actions';
import { hasGlobalPermission } from '$lib/auth/permissions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import UserIdentity from '$lib/components/UserIdentity.svelte';
import GameRevisionComparison from '$lib/games/GameRevisionComparison.svelte';
import GameRevisionPreview from '$lib/games/GameRevisionPreview.svelte';
import ReviewTimeline from '$lib/games/ReviewTimeline.svelte';
import { isPositiveDiscordId, validReviewComment } from '$lib/games/review-utils';

import type { PageProps } from './$types';

let { data }: PageProps = $props();
requireAuth(page.data.auth);
const api = createApi({ fetch });
const canReview = $derived(hasGlobalPermission(page.data.auth, 'games:review'));
let game = $state<GameEditorDto | null>(null);
let published = $state<GameDetailsDto | null>(null);
let dialog = $state<'publish' | 'changes' | 'owner' | 'delete' | null>(null);
let comment = $state('');
let ownerId = $state('');
let deleteConfirmation = $state('');
let isMutating = $state(false);
let loadError = $state(false);

$effect(() => {
	game = data.game;
	published = data.published;
	loadError = !data.game;
});

async function invalidateGames() {
	await Promise.all([
		invalidate('games:review'),
		invalidate(`games:review:${game?.id}`),
		invalidate('games:list'),
		invalidate(`games:${game?.id}`),
		invalidate('games:mine'),
		invalidate('user:games')
	]);
}

async function reload() {
	await invalidate(`games:review:${game?.id ?? page.params.id}`);
	location.reload();
}

function errorMessage(error: unknown) {
	if (!(error instanceof ApiHttpError)) return 'Сетевая ошибка.';
	if (error.status === 403) return 'Permission games:review больше недоступен.';
	if (error.status === 404) return 'Игра удалена или больше недоступна.';
	if (error.status === 409) return 'Состояние редакции уже изменил другой модератор.';
	if (error.status === 400) return 'Backend отклонил данные. Проверьте поля.';
	return `Операция не выполнена (${error.status}).`;
}

async function mutate(action: 'publish' | 'changes' | 'owner' | 'delete') {
	if (!game || isMutating) return;
	if (action === 'changes' && !validReviewComment(comment)) return;
	if (action === 'owner' && !isPositiveDiscordId(ownerId)) return;
	if (action === 'delete' && deleteConfirmation !== game.title) return;
	isMutating = true;
	try {
		if (action === 'publish') await api.publishReview(game.id, comment.trim() || undefined);
		if (action === 'changes') await api.requestChanges(game.id, comment.trim());
		if (action === 'owner') await api.transferOwner(game.id, ownerId.trim());
		if (action === 'delete') await api.deleteGame(game.id);
		await invalidateGames();
		dialog = null;
		comment = '';
		ownerId = '';
		deleteConfirmation = '';
		if (action === 'delete') {
			showSnackbar({ message: 'Игра удалена.', variant: 'success' });
			await goto('/admin/games');
			return;
		}
		showSnackbar({
			message:
				action === 'publish'
					? 'Игра опубликована.'
					: action === 'changes'
						? 'Игра возвращена на доработку.'
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
	ownerId = game?.owner_id ?? '';
	dialog = 'owner';
}
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Модерация', href: '/admin/games' }, { label: game?.title ?? 'Игра', href: '' }]} />

{#if !canReview}<section class="state"><h1>403</h1><p>Для модерации требуется permission games:review.</p></section>
{:else if loadError}<section class="state"><h1>Игра недоступна</h1><p>Игра удалена или не удалось загрузить редакцию.</p><Button as="a" href="/admin/games">Вернуться в очередь</Button></section>
{:else if game}
	<div class="page-header"><div><h1>{game.title}</h1><p class="status">ID: {game.id} · Версия v{game.version} · Статус: {game.status}</p><div class="owner-line">Владелец: <UserIdentity id={game.owner_id} /></div><p class="status">Изменено: {new Date(game.updated_at).toLocaleString('ru-RU')}</p>{#if game.submitted_at}<p class="status">Отправлено на ревью: {new Date(game.submitted_at).toLocaleString('ru-RU')}</p>{/if}</div>{#if game.has_published_version}<Button as="a" href={`/games/${game.slug}`} variant="outline">Публичная версия</Button>{/if}</div>
	<section><h2>Рабочая редакция</h2><GameRevisionPreview {game} /></section>
	{#if game.has_published_version}<section class="comparison-section"><h2>Сравнение с опубликованной версией v{game.published_version}</h2><GameRevisionComparison working={game} {published} /></section>{/if}
	<ReviewTimeline events={game.review_events} />
	<section class="decision-panel"><h2>Решение модератора</h2><p>Комментарий будет сохранён в истории ревью. Для возврата на доработку он обязателен.</p><textarea bind:value={comment} maxlength="2000" rows="6" placeholder="Комментарий модератора"></textarea><div class="decision-actions"><Button disabled={isMutating || game.status !== 'review'} onclick={() => (dialog = 'publish')}>Опубликовать</Button><Button variant="outline" color="error" disabled={isMutating || game.status !== 'review' || !validReviewComment(comment)} onclick={() => (dialog = 'changes')}>Вернуть на доработку</Button></div><div class="secondary-actions"><Button variant="ghost" disabled={isMutating} onclick={openOwner}>Сменить владельца</Button><Button variant="ghost" color="error" disabled={isMutating} onclick={() => (dialog = 'delete')}>Удалить игру</Button></div></section>

	<Modal open={dialog === 'publish'} title="Опубликовать редакцию" onClose={() => (dialog = null)}><p>Версия v{game.version} станет публичной.</p><div class="modal-actions"><Button disabled={isMutating} onclick={() => mutate('publish')}>Подтвердить публикацию</Button></div></Modal>
	<Modal open={dialog === 'changes'} title="Вернуть на доработку" onClose={() => (dialog = null)}><p>Автор снова получит доступ к редактированию игры.</p><p>Комментарий берётся из блока решения внизу страницы.</p><div class="modal-actions"><Button color="error" disabled={isMutating || !validReviewComment(comment)} onclick={() => mutate('changes')}>Вернуть</Button></div></Modal>
	<Modal open={dialog === 'owner'} title="Сменить владельца" onClose={() => (dialog = null)}><p>Текущий владелец: {game.owner_id}</p><label>Новый Discord ID<input bind:value={ownerId} inputmode="numeric" /></label><p class="warning">После смены владельца предыдущий владелец потеряет доступ к редактированию этой игры.</p><div class="modal-actions"><Button disabled={isMutating || !isPositiveDiscordId(ownerId)} onclick={() => mutate('owner')}>Сменить владельца</Button></div></Modal>
	<Modal open={dialog === 'delete'} title="Удалить игру" onClose={() => (dialog = null)}><p>Публичная страница, история и лайки будут удалены без возможности восстановления.</p><label>Введите название игры: <strong>{game.title}</strong><input bind:value={deleteConfirmation} /></label><div class="modal-actions"><Button color="error" disabled={isMutating || deleteConfirmation !== game.title} onclick={() => mutate('delete')}>Удалить навсегда</Button></div></Modal>
{/if}

<style>
	.page-header { align-items: center; display: flex; justify-content: space-between; margin: 1.5rem 0; } h1, h2, p { margin-top: 0; } .status { color: var(--color-text-secondary); margin-bottom: .35rem; } .owner-line { align-items: center; display: flex; gap: .35rem; margin: .5rem 0; } .modal-actions, .decision-actions, .secondary-actions { display: flex; flex-wrap: wrap; gap: .5rem; } section { margin: 1.5rem 0; } .comparison-section, .decision-panel { background: var(--color-bg-surface); border-radius: .65rem; padding: 1rem; } .decision-panel textarea { margin: .75rem 0; } .secondary-actions { border-top: 1px solid #303238; margin-top: 1rem; padding-top: 1rem; } label { display: grid; gap: .35rem; margin: 1rem 0; } input, textarea { background: var(--color-bg-surface); border: 1px solid #303238; border-radius: .4rem; color: inherit; font: inherit; padding: .6rem; width: 100%; } .warning { color: var(--color-warning); } .state { background: var(--color-bg-surface); border-radius: .65rem; padding: 2rem; text-align: center; } @media (max-width: 800px) { .page-header { align-items: flex-start; flex-direction: column; gap: 1rem; } }
</style>
