<script lang="ts">
import { IconJoystick } from '$lib/assets/icons';
import { auth } from '$lib/auth/auth.store.svelte';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import { formatGameDate } from '$lib/games/format-game-date';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const user = $derived(data.user);
const games = $derived(data.games);
const isOwn = $derived(auth.user?.id === user?.id);

function getAuthorName(author: { type: string; name?: string; discord_user_id?: string }): string {
	if (author.type === 'text' && author.name) return author.name;
	return 'Discord';
}
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: user?.nickname ?? user?.username ?? "Пользователь", href: `/${user?.username}` },
    { label: "Игры", href: "" },
  ]}
/>

<div class="header">
  <span class="header-icon"><IconJoystick /></span>
  <h1>Игры — {user?.nickname ?? user?.username}</h1>
</div>

{#if isOwn}
  <div class="actions">
    <a href="/games/mine" class="button">Управление проектами</a>
  </div>
{/if}

{#if games === null}
  <p>Не удалось загрузить список игр.</p>
{:else if games.items.length === 0}
  <p>У пользователя пока нет игр.</p>
{:else}
  <ul class="games">
    {#each games.items as game (game.id)}
      <li>
        <a class="game" href="/games/{game.slug}">
          <SkeletonImage
            class="game-image"
            src={game.thumbnail ?? ''}
            alt={game.title}
          />

          <div class="game-content">
            <h2 class="game-title">{game.title}</h2>

            <div class="game-meta">
              <span class="game-date">{formatGameDate(game.release_date)}</span>
              <span class="game-likes">♥ {game.likes_count}</span>
            </div>

            {#if game.tags.length > 0}
              <div class="game-tags">
                {#each game.tags as tag (tag.slug)}
                  <a class="tag-badge" href="/games?tag={tag.slug}">{tag.name}</a>
                {/each}
              </div>
            {/if}

            {#if game.authors.length > 0}
              <div class="game-authors">
                {game.authors.map(getAuthorName).join(', ')}
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

  .games {
    display: grid;
    gap: 1.5rem 1rem;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    list-style: none;
    margin: 1.5rem 0 0;
    padding: 0;
  }

  .game {
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

  .game:hover {
    opacity: 0.88;
    transform: translateY(-2px);
  }

  .game :global(.game-image) {
    aspect-ratio: 16 / 9;
    width: 100%;
  }

  .game-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: 0.625rem;
    gap: 0.375rem;
  }

  .game-title {
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

  .game-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
  }

  .game-tags {
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

  .game-authors {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: 767px) {
    .games {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .game {
      transition: none;
    }

    .game:hover {
      transform: none;
    }
  }
</style>
