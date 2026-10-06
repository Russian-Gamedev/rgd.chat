<script lang="ts">
import { IconCalendar, IconExternalLink, IconEye } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import ProjectAuthorsIdentity from '$lib/components/ProjectAuthorsIdentity.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import UserIdentity from '$lib/components/UserIdentity.svelte';
import { formatProjectDate } from '$lib/projects/format-project-date';
import MarkdownPreview from '$lib/projects/MarkdownPreview.svelte';
import { PROJECT_TYPE_LABELS } from '$lib/projects/project-type';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const project = $derived(data.project);
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Проекты", href: "/projects" },
    { label: project?.title ?? "Проект", href: "" },
  ]}
/>

{#if project === null}
  <p>Проект не найден.</p>
{:else}
  <article class="project-detail">
    {#if project.thumbnail}
      <SkeletonImage class="project-banner" src={project.thumbnail} alt={project.title} />
    {/if}

    <h1>{project.title}</h1>

    <div class="project-meta">
      <span class="meta-item project-type">{PROJECT_TYPE_LABELS[project.metadata.type]}</span>
      <span class="meta-item">
        <IconCalendar />
        {formatProjectDate(project.metadata.release_date)}
      </span>
      <span class="meta-item">
        <IconEye />
        ♥ {project.stats.likes_count}
      </span>
    </div>

    {#if project.credits.owner_id}
      <div class="project-owner">
        <strong>Владелец:</strong>
        <UserIdentity id={project.credits.owner_id} compact />
      </div>
    {/if}

    {#if project.tags.length > 0}
      <div class="project-tags">
        {#each project.tags as tag (tag.slug)}
          <span class="tag-badge">{tag.name}</span>
        {/each}
      </div>
    {/if}

    {#if project.credits.authors.length > 0}
      <div class="project-authors">
        <strong>Авторы:</strong>
        <ProjectAuthorsIdentity authors={project.credits.authors} />
      </div>
    {/if}

    {#if project.description}
      <div class="project-description">
        <MarkdownPreview source={project.description} />
      </div>
    {/if}

    {#if project.resources.links.length > 0}
      <div class="project-links">
        <h2>Ссылки</h2>
        <ul>
          {#each project.resources.links as link}
            <li>
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <IconExternalLink />
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if project.resources.attachments.length > 0}
      <div class="project-attachments">
        <h2>Вложения</h2>
        <ul>
          {#each project.resources.attachments as attachment}
            <li>
              {#if attachment.type === "image"}
                <img
                  src={attachment.url}
                  alt="Attachment"
                  class="attachment-image"
                />
              {:else}
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {attachment.url}
                </a>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </article>
{/if}

<style>
  .project-detail {
    max-width: 48rem;
  }

  :global(.project-banner) {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: 1.75rem;
  }

  .project-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.75rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .project-type {
    background-color: color-mix(in srgb, var(--color-text-secondary) 15%, transparent);
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .meta-item :global(svg) {
    width: 1rem;
    height: 1rem;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-bottom: 0.75rem;
  }

  .tag-badge {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    color: var(--color-primary);
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .project-authors {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  .project-description {
    line-height: 1.7;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
  }

  .project-links h2,
  .project-attachments h2 {
    font-size: 1.125rem;
    margin: 0 0 0.5rem;
  }

  .project-links ul,
  .project-attachments ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .link-item {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .link-item:hover {
    text-decoration: underline;
  }

  .link-item :global(svg) {
    width: 1rem;
    height: 1rem;
  }

  .attachment-image {
    max-width: 100%;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
  }
</style>
