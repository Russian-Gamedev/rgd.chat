<script lang="ts">
import { page } from '$app/state';
import { IconJoystick } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import { formatProjectDate } from '$lib/projects/format-project-date';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const user = $derived(data.user);
const projects = $derived(data.projects);
const currentUser = $derived(page.data.auth ?? null);
const isOwn = $derived(currentUser?.id === user?.id);

function getAuthorName(author: { type: string; name?: string; discord_user_id?: string }): string {
	if (author.type === 'text' && author.name) return author.name;
	return 'Discord';
}
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: user?.nickname ?? user?.username ?? "Пользователь", href: `/${user?.username}` },
    { label: "Проекты", href: "" },
  ]}
/>

<div class="header">
  <span class="header-icon"><IconJoystick /></span>
  <h1>Проекты — {user?.nickname ?? user?.username}</h1>
</div>

{#if isOwn}
  <div class="actions">
    <a href="/projects/mine" class="button">Управление проектами</a>
  </div>
{/if}

{#if projects === null}
  <p>Не удалось загрузить список проектов.</p>
{:else if projects.items.length === 0}
  <p>У пользователя пока нет проектов.</p>
{:else}
  <ul class="projects">
    {#each projects.items as project (project.id)}
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
              {#if project.release_date}
                <span class="project-date">{formatProjectDate(project.release_date)}</span>
              {/if}
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
                {project.authors.map(getAuthorName).join(', ')}
              </div>
            {/if}
          </div>
        </a>
      </li>
    {/each}
  </ul>
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

  .actions {
    margin-bottom: 1rem;
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
