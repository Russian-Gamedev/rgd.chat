<script lang="ts">
import { onDestroy } from 'svelte';

import { goto } from '$app/navigation';
import { page } from '$app/state';
import { requireAuth } from '$lib/auth/auth.actions';
import { hasGlobalPermission } from '$lib/auth/permissions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import UserIdentity from '$lib/components/UserIdentity.svelte';
import { reviewWaitingClass } from '$lib/games/review-utils';

import type { PageProps } from './$types';

let { data }: PageProps = $props();
requireAuth(page.data.auth);
const canReview = $derived(hasGlobalPermission(page.data.auth, 'games:review'));
let displayed = $state<typeof data.games>(null);
let search = $state('');
let timer: ReturnType<typeof setTimeout> | undefined;

$effect(() => {
	if (data.games) displayed = data.games;
	search = data.filters.search;
});

function navigate(changes: Partial<typeof data.filters>) {
	const next = { ...data.filters, ...changes, offset: 0 };
	const params = new URLSearchParams();
	if (next.status !== 'review') params.set('status', next.status);
	if (next.search) params.set('search', next.search);
	if (next.ownerId) params.set('owner_id', next.ownerId);
	const query = params.toString();
	void goto(query ? `/admin/games?${query}` : '/admin/games', {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
}

function onSearch(value: string) {
	search = value;
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => navigate({ search: value }), 350);
}

function href(offset: number) {
	const params = new URLSearchParams();
	if (data.filters.status !== 'review') params.set('status', data.filters.status);
	if (data.filters.search) params.set('search', data.filters.search);
	if (data.filters.ownerId) params.set('owner_id', data.filters.ownerId);
	if (offset) params.set('offset', String(offset));
	const query = params.toString();
	return query ? `/admin/games?${query}` : '/admin/games';
}

onDestroy(() => {
	if (timer) clearTimeout(timer);
});
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Игры', href: '/games' }, { label: 'Модерация', href: '' }]} />

{#if !canReview}
	<section class="state"><h1>403</h1><p>Для модерации требуется permission games:review.</p></section>
{:else}
	<div class="header"><div><h1>Модерация игр</h1><p>Очередь редакций и решения модераторов.</p></div></div>
	<section class="filters">
		<label>Статус<select value={data.filters.status} onchange={(event) => navigate({ status: event.currentTarget.value as typeof data.filters.status })}><option value="review">На ревью</option><option value="draft">Черновики</option><option value="published">Опубликованные</option></select></label>
		<label>Название<input value={search} oninput={(event) => onSearch(event.currentTarget.value)} placeholder="Поиск" /></label>
		<label>Discord ID владельца<input value={data.filters.ownerId} onchange={(event) => navigate({ ownerId: event.currentTarget.value })} /></label>
	</section>
	{#if !displayed}
		<section class="state"><h2>Не удалось загрузить очередь</h2><Button as="a" href={href(data.filters.offset)}>Повторить</Button></section>
	{:else if displayed.items.length === 0}
		<section class="state"><h2>Редакций нет</h2><p>По текущим фильтрам ничего не найдено.</p></section>
	{:else}
		<div class="table-wrap"><table><colgroup><col class="col-game" /><col class="col-owner" /><col class="col-version" /><col class="col-status" /><col class="col-date" /><col class="col-date" /><col class="col-action" /></colgroup><thead><tr><th>Игра</th><th>Владелец</th><th>Версия</th><th>Статус</th><th>Отправлено</th><th>Изменено</th><th>Действие</th></tr></thead><tbody>{#each displayed.items as game (game.revision_id)}<tr><td class="game-cell"><strong>{game.title || 'Без названия'}</strong><small>{game.id}</small></td><td class="owner-cell"><UserIdentity id={game.owner_id} compact /></td><td class="nowrap">v{game.version}</td><td class="nowrap"><span class:waiting={game.status === 'review'} class:warning={game.status === 'review' && reviewWaitingClass(game.submitted_at) === 'warning'} class:critical={game.status === 'review' && reviewWaitingClass(game.submitted_at) === 'critical'}>{game.status}</span></td><td class="nowrap">{game.submitted_at ? new Date(game.submitted_at).toLocaleString('ru-RU') : '—'}</td><td class="nowrap">{new Date(game.updated_at).toLocaleString('ru-RU')}</td><td class="action-cell"><Button as="a" href={`/admin/games/${game.id}`} variant="outline">Открыть</Button></td></tr>{/each}</tbody></table></div>
		<nav class="pagination"><span>{displayed.offset + 1}–{Math.min(displayed.offset + displayed.items.length, displayed.total)} из {displayed.total}</span>{#if displayed.offset > 0}<Button as="a" variant="outline" href={href(Math.max(0, displayed.offset - displayed.limit))}>Назад</Button>{/if}{#if displayed.offset + displayed.limit < displayed.total}<Button as="a" variant="outline" href={href(displayed.offset + displayed.limit)}>Далее</Button>{/if}</nav>
	{/if}
{/if}

<style>
	.header, .filters, .pagination { align-items: center; display: flex; flex-wrap: wrap; gap: .75rem; }
	.header { justify-content: space-between; margin: 1.5rem 0; }
	.filters { align-items: end; margin-bottom: 1.5rem; } label { display: grid; gap: .3rem; } input, select { background: var(--color-bg-surface); border: 1px solid #303238; border-radius: .4rem; color: inherit; font: inherit; padding: .55rem; }
	.table-wrap { overflow-x: auto; } table { border-collapse: collapse; min-width: 980px; table-layout: fixed; width: 100%; } .col-game { width: 22%; } .col-owner { width: 19%; } .col-version { width: 8%; } .col-status { width: 10%; } .col-date { width: 14%; } .col-action { width: 13%; } th, td { border-bottom: 1px solid #303238; height: 4.5rem; padding: .65rem .75rem; text-align: left; vertical-align: middle; } .game-cell { overflow: hidden; } .game-cell strong, .game-cell small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } small { color: var(--color-text-secondary); } .owner-cell :global(.identity) { max-width: 100%; } .nowrap { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .action-cell { text-align: right; } td span { background: color-mix(in srgb, var(--color-primary) 18%, transparent); border-radius: 999px; padding: .2rem .5rem; } td span.waiting { background: color-mix(in srgb, var(--color-warning) 22%, transparent); } td span.warning { background: color-mix(in srgb, var(--color-warning) 30%, transparent); } td span.critical { background: color-mix(in srgb, var(--color-error) 30%, transparent); }
	.pagination { justify-content: center; margin: 1.5rem 0; } .state { background: var(--color-bg-surface); border-radius: .65rem; padding: 2rem; text-align: center; }
</style>
