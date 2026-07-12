<script lang="ts">
import type { GameReviewEvent } from '$lib/api/api.type';

let { events }: { events: GameReviewEvent[] } = $props();

const sortedEvents = $derived(
	[...events].sort((left, right) => Date.parse(left.created_at) - Date.parse(right.created_at))
);

const labels = {
	submitted: 'Отправлено на ревью',
	changes_requested: 'Запрошены изменения',
	published: 'Опубликовано'
} as const;
</script>

{#if sortedEvents.length > 0}
  <section class="timeline" aria-labelledby="review-history-title">
    <h2 id="review-history-title">История ревью</h2>
    <ol>
      {#each sortedEvents as event (event.id)}
        <li>
          <div class="event-header">
            <strong>{labels[event.action]}</strong>
            <time datetime={event.created_at}>{new Date(event.created_at).toLocaleString('ru-RU')}</time>
          </div>
          <div class="event-meta">
            {#if event.version !== undefined}<span>Версия {event.version}</span>{/if}
            <span>Actor: {event.actor_id}</span>
          </div>
          {#if event.comment}<p>{event.comment}</p>{/if}
        </li>
      {/each}
    </ol>
  </section>
{/if}

<style>
  .timeline {
    margin-top: 2rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  ol {
    border-left: 2px solid var(--color-primary);
    list-style: none;
    margin: 0;
    padding: 0 0 0 1.25rem;
  }

  li {
    background: var(--color-bg-surface);
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 1rem;
    position: relative;
  }

  li::before {
    background: var(--color-primary);
    border-radius: 50%;
    content: '';
    height: 0.65rem;
    left: -1.64rem;
    position: absolute;
    top: 1.2rem;
    width: 0.65rem;
  }

  .event-header,
  .event-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    justify-content: space-between;
  }

  time,
  .event-meta {
    color: var(--color-text-secondary);
    font-size: 0.8rem;
  }

  p {
    margin: 0.75rem 0 0;
    white-space: pre-wrap;
  }
</style>
