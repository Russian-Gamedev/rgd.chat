<script lang="ts">
import { page } from '$app/state';
import type { GameRevisionStatus } from '$lib/api/api.type';
import { requireAuth } from '$lib/auth/auth.actions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';

import type { PageProps } from './$types';

let { data }: PageProps = $props();
requireAuth(page.data.auth);

const labels: Record<GameRevisionStatus, string> = {
	draft: 'Черновик',
	review: 'На ревью',
	published: 'Опубликовано'
};

function pageHref(offset: number): string {
	const params = new URLSearchParams();
	if (data.status) params.set('status', data.status);
	if (offset > 0) params.set('offset', String(offset));
	const query = params.toString();
	return query ? `/games/mine?${query}` : '/games/mine';
}
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Игры', href: '/games' }, { label: 'Мои проекты', href: '' }]} />

<div class="header">
  <div>
    <h1>Мои игровые проекты</h1>
    <p>Черновики, редакции на ревью и опубликованные версии.</p>
  </div>
  <Button as="a" href="/games/editor/new">Создать игру</Button>
</div>

<nav class="filters" aria-label="Фильтр проектов">
  <a class:active={!data.status} href="/games/mine">Все</a>
  <a class:active={data.status === 'draft'} href="/games/mine?status=draft">Черновики</a>
  <a class:active={data.status === 'review'} href="/games/mine?status=review">На ревью</a>
  <a class:active={data.status === 'published'} href="/games/mine?status=published">Опубликованные</a>
</nav>

{#if data.games === null}
  <section class="empty"><h2>Не удалось загрузить проекты</h2><p>Обновите страницу или повторите позже.</p></section>
{:else if data.games.items.length === 0}
  <section class="empty">
    <h2>{data.status ? 'В этом состоянии проектов нет' : 'У вас пока нет игровых проектов'}</h2>
    <p>Создайте игру, сохраните черновик и отправьте его на ревью.</p>
    <Button as="a" href="/games/editor/new">Создать игру</Button>
  </section>
{:else}
  <ul class="projects">
    {#each data.games.items as game (game.revision_id)}
      <li>
        <div class="project-main">
          <div class="title-row">
            <h2>{game.title || 'Без названия'}</h2>
            <span class:review={game.status === 'review'} class:published={game.status === 'published'}>{labels[game.status]}</span>
          </div>
          <p>Редакция v{game.version}</p>
          {#if game.has_published_version && game.status !== 'published'}
            <p class="published-note">Публичная версия остаётся доступна, новая редакция — {labels[game.status].toLowerCase()}.</p>
          {/if}
        </div>
        <div class="actions">
          {#if game.status === 'draft'}
            <Button as="a" href={`/games/editor/${game.id}`}>Продолжить редактирование</Button>
          {:else if game.status === 'review'}
            <Button as="a" href={`/games/editor/${game.id}`} variant="outline">Открыть состояние ревью</Button>
          {:else}
            <Button as="a" href={`/games/editor/${game.id}`}>Создать новую редакцию</Button>
          {/if}
          {#if game.has_published_version || game.status === 'published'}
            <Button as="a" href={`/games/${game.slug}`} variant="ghost">Публичная версия</Button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>

  <nav class="pagination" aria-label="Пагинация">
    {#if data.games.offset > 0}
      <Button as="a" variant="outline" href={pageHref(Math.max(0, data.games.offset - data.games.limit))}>Назад</Button>
    {/if}
    <span>{data.games.offset + 1}–{Math.min(data.games.offset + data.games.items.length, data.games.total)} из {data.games.total}</span>
    {#if data.games.offset + data.games.limit < data.games.total}
      <Button as="a" variant="outline" href={pageHref(data.games.offset + data.games.limit)}>Далее</Button>
    {/if}
  </nav>
{/if}

<style>
  .header,
  .title-row,
  .actions,
  .pagination {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .header {
    justify-content: space-between;
    margin: 1.5rem 0;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .header p,
  .project-main > p {
    color: var(--color-text-secondary);
    margin-top: 0.35rem;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  .filters a {
    border-radius: 999px;
    color: var(--color-text-secondary);
    padding: 0.45rem 0.8rem;
    text-decoration: none;
  }

  .filters a.active {
    background: var(--color-primary);
    color: var(--color-text);
  }

  .projects {
    display: grid;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .projects li {
    align-items: center;
    background: var(--color-bg-surface);
    border-radius: 0.65rem;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem;
  }

  .title-row h2 {
    font-size: 1.1rem;
  }

  .title-row span {
    background: color-mix(in srgb, var(--color-primary) 18%, transparent);
    border-radius: 999px;
    font-size: 0.75rem;
    padding: 0.25rem 0.55rem;
  }

  .title-row span.review {
    background: color-mix(in srgb, var(--color-warning) 20%, transparent);
  }

  .title-row span.published {
    background: color-mix(in srgb, var(--color-success) 20%, transparent);
  }

  .published-note {
    max-width: 42rem;
  }

  .empty {
    background: var(--color-bg-surface);
    border-radius: 0.65rem;
    padding: 2rem;
    text-align: center;
  }

  .empty p {
    color: var(--color-text-secondary);
    margin: 0.5rem 0 1rem;
  }

  .empty :global(.button) {
    margin: auto;
  }

  .pagination {
    justify-content: center;
    margin-top: 1.5rem;
  }

  @media (max-width: 800px) {
    .projects li {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
