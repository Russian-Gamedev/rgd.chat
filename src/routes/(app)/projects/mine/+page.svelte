<script lang="ts">
import { page } from '$app/state';
import type { ProjectRevisionStatus } from '$lib/api/api.type';
import { requireAuth } from '$lib/auth/auth.actions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';

import type { PageProps } from './$types';

let { data }: PageProps = $props();
requireAuth(page.data.auth);

const labels: Record<ProjectRevisionStatus, string> = {
	draft: 'Черновик',
	review: 'На ревью',
	published: 'Опубликовано'
};

function pageHref(offset: number): string {
	const params = new URLSearchParams();
	if (data.status) params.set('status', data.status);
	if (offset > 0) params.set('offset', String(offset));
	const query = params.toString();
	return query ? `/projects/mine?${query}` : '/projects/mine';
}
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Проекты', href: '/projects' }, { label: 'Мои проекты', href: '' }]} />

<div class="header">
  <div>
    <h1>Мои проекты</h1>
    <p>Черновики, редакции на ревью и опубликованные версии.</p>
  </div>
  <Button as="a" href="/projects/editor/new">Создать проект</Button>
</div>

<nav class="filters" aria-label="Фильтр проектов">
  <a class:active={!data.status} href="/projects/mine">Все</a>
  <a class:active={data.status === 'draft'} href="/projects/mine?status=draft">Черновики</a>
  <a class:active={data.status === 'review'} href="/projects/mine?status=review">На ревью</a>
  <a class:active={data.status === 'published'} href="/projects/mine?status=published">Опубликованные</a>
</nav>

{#if data.projects === null}
  <section class="empty"><h2>Не удалось загрузить проекты</h2><p>Обновите страницу или повторите позже.</p></section>
{:else if data.projects.items.length === 0}
  <section class="empty">
    <h2>{data.status ? 'В этом состоянии проектов нет' : 'У вас пока нет проектов'}</h2>
    <p>Создайте проект, сохраните черновик и отправьте его на ревью.</p>
    <Button as="a" href="/projects/editor/new">Создать проект</Button>
  </section>
{:else}
  <ul class="projects">
    {#each data.projects.items as project (project.revision_id)}
      <li>
        <div class="project-main">
          <div class="title-row">
            <h2>{project.title || 'Без названия'}</h2>
            <span class:review={project.status === 'review'} class:published={project.status === 'published'}>{labels[project.status]}</span>
          </div>
          <p>Редакция v{project.version}</p>
          {#if project.has_published_version && project.status !== 'published'}
            <p class="published-note">Публичная версия остаётся доступна, новая редакция — {labels[project.status].toLowerCase()}.</p>
          {/if}
        </div>
        <div class="actions">
          {#if project.status === 'draft'}
            <Button as="a" href={`/projects/editor/${project.id}`}>Продолжить редактирование</Button>
          {:else if project.status === 'review'}
            <Button as="a" href={`/projects/editor/${project.id}`} variant="outline">Открыть состояние ревью</Button>
          {:else}
            <Button as="a" href={`/projects/editor/${project.id}`}>Создать новую редакцию</Button>
          {/if}
          {#if project.has_published_version || project.status === 'published'}
            <Button as="a" href={`/projects/${project.slug}`} variant="ghost">Публичная версия</Button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>

  <nav class="pagination" aria-label="Пагинация">
    {#if data.projects.offset > 0}
      <Button as="a" variant="outline" href={pageHref(Math.max(0, data.projects.offset - data.projects.limit))}>Назад</Button>
    {/if}
    <span>{data.projects.offset + 1}–{Math.min(data.projects.offset + data.projects.items.length, data.projects.total)} из {data.projects.total}</span>
    {#if data.projects.offset + data.projects.limit < data.projects.total}
      <Button as="a" variant="outline" href={pageHref(data.projects.offset + data.projects.limit)}>Далее</Button>
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
