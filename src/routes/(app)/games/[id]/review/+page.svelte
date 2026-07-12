<script lang="ts">
import { onMount } from 'svelte';

import { invalidate } from '$app/navigation';
import { page } from '$app/state';
import { ApiHttpError, createApi } from '$lib/api/api';
import type { GameEditorDto, GameTagDto } from '$lib/api/api.type';
import { requireAuth } from '$lib/auth/auth.actions';
import { hasGlobalPermission } from '$lib/auth/permissions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import GameEditorForm from '$lib/games/GameEditorForm.svelte';
import { editorToForm, emptyGameForm } from '$lib/games/game-editor';
import ReviewTimeline from '$lib/games/ReviewTimeline.svelte';

requireAuth(page.data.auth);

const api = createApi({ fetch });
const canReview = $derived(
	Boolean(page.data.auth && hasGlobalPermission(page.data.auth, 'games:review'))
);
const gameId = $derived(page.params.id as string);
let game = $state<GameEditorDto | null>(null);
let form = $state(emptyGameForm());
let tagOptions = $state<GameTagDto[]>([]);
let loadState = $state<'loading' | 'ready' | 'not-found' | 'forbidden' | 'error'>('loading');
let comment = $state('');
let isMutating = $state(false);

function applyGame(next: GameEditorDto) {
	game = next;
	form = editorToForm(next);
	comment = '';
}

function mutationError(error: unknown): string {
	if (!(error instanceof ApiHttpError)) return 'Сетевая ошибка.';
	if (error.status === 409) return 'Редакция уже изменила состояние. Перезагрузите страницу.';
	if (error.status === 403) return 'Недостаточно прав для этого действия.';
	return `Операция не выполнена (${error.status}).`;
}

async function loadReview() {
	loadState = 'loading';
	try {
		applyGame(await api.getReviewGame(gameId));
		loadState = 'ready';
	} catch (error) {
		if (error instanceof ApiHttpError && error.status === 404) loadState = 'not-found';
		else if (error instanceof ApiHttpError && error.status === 403) loadState = 'forbidden';
		else loadState = 'error';
	}
}

async function completeReview(action: 'publish' | 'changes') {
	if (isMutating || !game) return;
	if (action === 'changes' && !comment.trim()) {
		showSnackbar({ message: 'Для возврата на доработку нужен комментарий.', variant: 'error' });
		return;
	}
	if (action === 'publish' && !confirm(`Опубликовать версию ${game.version}?`)) return;

	isMutating = true;
	try {
		const next =
			action === 'publish'
				? await api.publishReview(gameId, comment.trim() || undefined)
				: await api.requestChanges(gameId, comment.trim());
		applyGame(next);
		await Promise.all([
			invalidate('games:list'),
			invalidate('games:mine'),
			invalidate(`games:${gameId}`),
			invalidate('user:games')
		]);
		showSnackbar({
			message: action === 'publish' ? 'Игра опубликована.' : 'Редакция возвращена на доработку.',
			variant: 'success'
		});
	} catch (error) {
		showSnackbar({ message: mutationError(error), variant: 'error', duration: 7000 });
	} finally {
		isMutating = false;
	}
}

onMount(() => {
	if (!canReview) {
		loadState = 'forbidden';
		return;
	}
	Promise.all([
		loadReview(),
		api
			.listTags()
			.then((value) => (tagOptions = value))
			.catch(() => undefined)
	]);
});
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Игры', href: '/games' }, { label: 'Ревью', href: '' }]} />

<h1>Ревью игры</h1>

{#if loadState === 'loading'}
  <p>Загрузка…</p>
{:else if loadState === 'forbidden'}
  <section class="state"><h2>Нет доступа</h2><p>Для ревью требуется глобальное разрешение games:review.</p></section>
{:else if loadState === 'not-found'}
  <section class="state"><h2>Игра не найдена</h2></section>
{:else if loadState === 'error'}
  <section class="state"><h2>Не удалось загрузить редакцию</h2><Button type="button" onclick={loadReview}>Повторить</Button></section>
{:else if game}
  <div class="meta">
    <strong>{game.title}</strong>
    <span>Версия {game.version}</span>
    <span>Статус: {game.status}</span>
    <span>Владелец: {game.owner_id}</span>
  </div>

  <GameEditorForm bind:form tagOptions={tagOptions} readonly />

  {#if game.status === 'review'}
    <section class="decision">
      <label for="review-comment">Комментарий ревьюера</label>
      <textarea id="review-comment" bind:value={comment} rows="5" maxlength="4000" placeholder="Обязателен при возврате на доработку"></textarea>
      <div class="actions">
        <Button type="button" disabled={isMutating} onclick={() => completeReview('publish')}>Опубликовать</Button>
        <Button type="button" color="error" variant="outline" disabled={isMutating || !comment.trim()} onclick={() => completeReview('changes')}>Запросить изменения</Button>
      </div>
    </section>
  {:else}
    <section class="state"><p>Редакция уже обработана. Текущее состояние: {game.status}.</p></section>
  {/if}

  <ReviewTimeline events={game.review_events} />
{/if}

<style>
  h1 {
    margin: 1.5rem 0;
  }

  .meta,
  .state,
  .decision {
    background: var(--color-bg-surface);
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
  }

  .decision {
    margin-top: 2rem;
  }

  label {
    display: block;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  textarea {
    background: var(--color-bg);
    border: 1px solid #303238;
    border-radius: 0.5rem;
    color: var(--color-text);
    font: inherit;
    padding: 0.75rem;
    resize: vertical;
    width: 100%;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
</style>
