<script lang="ts">
import { IconCalendar, IconExternalLink, IconEye } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import { formatGameDate } from '$lib/games/format-game-date';
import MarkdownPreview from '$lib/games/MarkdownPreview.svelte';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const game = $derived(data.game);

function getAuthorName(author: { type: string; name?: string; discord_user_id?: string }): string {
	if (author.type === 'text' && author.name) return author.name;
	return 'Discord';
}
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Игры", href: "/games" },
    { label: game?.title ?? "Игра", href: "" },
  ]}
/>

{#if game === null}
  <p>Игра не найдена.</p>
{:else}
  <article class="game-detail">
    {#if game.image}
      <SkeletonImage
        class="game-banner"
        src={game.image}
        alt={game.title}
      />
    {/if}

    <h1>{game.title}</h1>

    <div class="game-meta">
      <span class="meta-item">
        <IconCalendar />
        {formatGameDate(game.release_date)}
      </span>
      <span class="meta-item">
        <IconEye />
        ♥ {game.likes_count}
      </span>
    </div>

    {#if game.tags.length > 0}
      <div class="game-tags">
        {#each game.tags as tag}
          <span class="tag-badge">{tag.name}</span>
        {/each}
      </div>
    {/if}

    {#if game.authors.length > 0}
      <div class="game-authors">
        <strong>Авторы:</strong> {game.authors.map(getAuthorName).join(', ')}
      </div>
    {/if}

    {#if game.description}
      <div class="game-description">
        <MarkdownPreview source={game.description} />
      </div>
    {/if}

    {#if game.links && game.links.length > 0}
      <div class="game-links">
        <h2>Ссылки</h2>
        <ul>
          {#each game.links as link}
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

    {#if game.attachments && game.attachments.length > 0}
      <div class="game-attachments">
        <h2>Вложения</h2>
        <ul>
          {#each game.attachments as attachment}
            <li>
              {#if attachment.type === 'image'}
                <img src={attachment.url} alt="Attachment" class="attachment-image" />
              {:else}
                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
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
  .game-detail {
    max-width: 48rem;
  }

  :global(.game-banner) {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: 1.75rem;
  }

  .game-meta {
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

  .meta-item :global(svg) {
    width: 1rem;
    height: 1rem;
  }

  .game-tags {
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

  .game-authors {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  .game-description {
    line-height: 1.7;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
  }

  .game-links h2,
  .game-attachments h2 {
    font-size: 1.125rem;
    margin: 0 0 0.5rem;
  }

  .game-links ul,
  .game-attachments ul {
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
