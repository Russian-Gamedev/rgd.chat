<script lang="ts">
import { onMount } from 'svelte';

import { page } from '$app/state';
import { createApi } from '$lib/api/api';
import type { ProjectListResponseDto, User } from '$lib/api/api.type';
import { IconJoystick } from '$lib/assets/icons';
import { hasGlobalPermission } from '$lib/auth/permissions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import ProjectAuthorsIdentity from '$lib/components/ProjectAuthorsIdentity.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import { formatProjectDate } from '$lib/projects/format-project-date';
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_OPTIONS } from '$lib/projects/project-type';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const projects = $derived(data.projects);
const activeType = $derived(data.type);
const activeTag = $derived(page.url.searchParams.get('tag') || undefined);
let loadedPages = $state<ProjectListResponseDto[]>([]);
let isLoadingMore = $state(false);
let hasLoadError = $state(false);
let sentinel: HTMLElement | undefined = $state();

const items = $derived([...(projects?.items ?? []), ...loadedPages.flatMap((page) => page.items)]);
const currentOffset = $derived(loadedPages.at(-1)?.offset ?? projects?.offset ?? 0);
const total = $derived(loadedPages.at(-1)?.total ?? projects?.total ?? 0);
const limit = $derived(loadedPages.at(-1)?.limit ?? projects?.limit ?? 20);
const hasMore = $derived(projects !== null && currentOffset + limit < total);
const currentUser = $derived(page.data.auth as User | null);

function projectsHref(type: string | null): string {
	const params = new URLSearchParams();
	if (activeTag) params.set('tag', activeTag);
	if (type) params.set('type', type);
	const query = params.toString();
	return query ? `/projects?${query}` : '/projects';
}

async function loadNextPage(options?: { force?: boolean }) {
	if (isLoadingMore || !hasMore) return;
	if (hasLoadError && !options?.force) return;

	isLoadingMore = true;
	hasLoadError = false;

	try {
		const api = createApi({ fetch });
		const nextPage = await api.listPublishedProjects({
			limit,
			offset: currentOffset + limit,
			tag: activeTag,
			type: activeType
		});

		loadedPages = [...loadedPages, nextPage];
	} catch {
		hasLoadError = true;
	} finally {
		isLoadingMore = false;

		if (hasMore && sentinel && !hasLoadError) {
			const rect = sentinel.getBoundingClientRect();
			const threshold = window.innerHeight + 400;
			if (rect.top <= threshold && rect.bottom >= 0) {
				loadNextPage();
			}
		}
	}
}

onMount(() => {
	let destroyObserver: (() => void) | undefined;

	if (sentinel) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					loadNextPage();
				}
			},
			{ rootMargin: '400px 0px' }
		);

		observer.observe(sentinel);
		destroyObserver = () => observer.disconnect();
	}

	return () => {
		destroyObserver?.();
	};
});
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Проекты", href: "/projects" },
  ]}
/>

<div class="header">
  <span class="header-icon"><IconJoystick /></span>
  <h1>Проекты</h1>
</div>

<p class="description">
  Коллекция проектов от сообщества RGD. Игры, сервисы, инструменты и другие проекты
  участников.
</p>

{#if currentUser}
  <div class="actions">
    <a href="/projects/mine" class="button">Мои проекты</a>
    <a href="/projects/editor/new" class="button">Создать проект</a>
    {#if hasGlobalPermission(currentUser, 'projects:review')}
      <Button as="a" href="/admin/projects" color="error" variant="ghost">Админка проектов</Button>
    {/if}
  </div>
{/if}

<nav class="type-filters" aria-label="Фильтр по типу проектов">
  <a class:active={!activeType} href={projectsHref(null)}>Все</a>
  {#each PROJECT_TYPE_OPTIONS as option (option.value)}
    <a class:active={activeType === option.value} href={projectsHref(option.value)}>
      {option.label}
    </a>
  {/each}
</nav>

{#if projects === null}
  <p>Не удалось загрузить список проектов.</p>
{:else if items.length === 0 && !hasMore}
  <p>Проекты не найдены.</p>
{:else}
  <ul class="projects">
    {#each items as project (project.id)}
      <li>
        <a class="project" href="/projects/{project.slug}">
          <SkeletonImage
            class="project-image"
            src={project.thumbnail ?? ''}
            alt={project.title}
          />

          <div class="project-content">
            <h2 class="project-title">{project.title}</h2>

            <div class="project-meta">
              <span class="project-type">{PROJECT_TYPE_LABELS[project.type]}</span>
              <span class="project-date">{formatProjectDate(project.release_date)}</span>
              <span class="project-likes">♥ {project.likes_count}</span>
            </div>

            {#if project.tags.length > 0}
              <div class="project-tags">
                {#each project.tags as tag (tag.slug)}
                  <a class="tag-badge" href="/projects?tag={tag.slug}">{tag.name}</a>
                {/each}
              </div>
            {/if}

            {#if project.authors.length > 0}
              <div class="project-authors">
              <ProjectAuthorsIdentity authors={project.authors} />
              </div>
            {/if}
          </div>
        </a>
      </li>
    {/each}
  </ul>

  <div class="loader" bind:this={sentinel}>
    {#if isLoadingMore}
      <p>Загружаем ещё проекты...</p>
    {:else if hasLoadError}
      <button
        class="retry-button"
        type="button"
        onclick={() => loadNextPage({ force: true })}
      >
        Повторить загрузку
      </button>
    {:else if !hasMore}
      <p>Больше проектов нет.</p>
    {/if}
  </div>
{/if}

<style>
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 24px 0;
  }

  .header h1 {
    margin: 0;
  }

  .header-icon {
    width: 28px;
    height: 28px;
    color: var(--color-text);
  }

  .projects {
    display: grid;
    gap: 1.5rem 1rem;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    list-style: none;
    margin: 1.5rem 0 0;
    padding: 0;
  }

  .project {
    align-items: stretch;
    background-color: var(--color-bg-surface);
    border-radius: 0.5rem;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    text-decoration: none;
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  .project:hover {
    opacity: 0.88;
    transform: translateY(-2px);
  }

  .project :global(.project-image) {
    aspect-ratio: 16 / 9;
    width: 100%;
  }

  .project-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: 0.625rem;
    gap: 0.375rem;
  }

  .project-title {
    display: -webkit-box;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .project-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
  }

  .project-type {
    background-color: color-mix(in srgb, var(--color-text-secondary) 15%, transparent);
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .type-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .type-filters a {
    border: 1px solid color-mix(in srgb, var(--color-text-secondary) 30%, transparent);
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .type-filters a.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text);
    font-weight: 600;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tag-badge {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    color: var(--color-primary);
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .project-authors {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
  }

  .loader {
    display: flex;
    justify-content: center;
    min-height: 4rem;
    padding: 1.5rem 0;
  }

  .loader p {
    font-size: 1rem;
  }

  .retry-button {
    border: 0;
    border-radius: 0.5rem;
    background-color: var(--color-primary);
    color: var(--color-text);
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    padding: 0.75rem 1rem;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .button {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-primary);
    color: var(--color-text);
    border-radius: 0.5rem;
    padding: 0.625rem 1rem;
    font-weight: 700;
    font-size: 0.875rem;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 180ms ease;
  }

  .button:hover {
    opacity: 0.85;
  }

  @media (max-width: 767px) {
    .projects {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .project {
      transition: none;
    }

    .project:hover {
      transform: none;
    }
  }
</style>
