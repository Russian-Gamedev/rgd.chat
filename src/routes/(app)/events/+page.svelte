<script lang="ts">
import { IconCalendar } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';

import type { PageProps } from './$types';
import AddEventModal from './AddEventModal.svelte';
import { eventNames } from './events.shared';

let { data }: PageProps = $props();

const eventsList = $derived(data.eventsList ?? null);

let isAddEventOpen = $state(false);
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "События", href: "/events" },
  ]}
/>

<div class="header">
  <span class="header-icon"><IconCalendar /></span>
  <h1>События</h1>
</div>

<p class="description">
  Шаблоны сообщений о событиях на сервере: вступления, выходы, баны и кики.
  Бот выбирает случайный шаблон при наступлении события
</p>

<p class="description">
  Вы можете добавить свои через кнопку ниже либо в дискорд боте через
  <code>/event add</code>
</p>

<div class="actions">
  <Button onclick={() => (isAddEventOpen = true)}>Добавить свой</Button>
</div>

{#if !eventsList}
  <p>Не удалось загрузить список событий.</p>
{:else if eventsList.length === 0}
  <p>События не найдены.</p>
{:else}
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Пользователь</th>
          <th>Событие</th>
          <th>Сообщение</th>
        </tr>
      </thead>
      <tbody>
        {#each eventsList as item (item.id)}
          <tr>
            <td>
              <div class="user-cell">
                {#if item.author?.avatar_url}
                  <img
                    class="user-avatar"
                    src={item.author.avatar_url}
                    alt={item.author.username}
                  />
                {:else}
                  <span class="user-avatar user-placeholder" aria-hidden="true"
                    >{item.author?.username?.[0]?.toUpperCase() ?? "?"}</span
                  >
                {/if}
                <span>{item.author?.username ?? "Unknown"}</span>
              </div>
            </td>
            <td class="event-cell">{eventNames[item.event] ?? item.event}</td>
            <td>{item.message}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<AddEventModal open={isAddEventOpen} onClose={() => (isAddEventOpen = false)} />

<style>
  .description + .description {
    margin-top: 1rem;
  }

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

  .table-wrapper {
    overflow-x: auto;
  }

  .actions {
    display: flex;
    margin-top: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 14px;
  }

  thead {
    background-color: var(--color-bg-surface);
  }

  th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 700;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-text) 8%, transparent);
  }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    object-fit: cover;
    background-color: var(--color-bg);
    flex: 0 0 auto;
  }

  .user-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    font-size: 12px;
    font-weight: 700;
  }

  .event-cell {
    white-space: nowrap;
  }

  tbody tr:hover {
    background-color: color-mix(in srgb, var(--color-primary) 6%, transparent);
  }
</style>
