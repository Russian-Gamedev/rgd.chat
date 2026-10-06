<script lang="ts">
import type { GuildEventAuthor } from '$lib/api/api.type';
import { IconCalendar } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Select, { type SelectOption } from '$lib/components/Select.svelte';

import type { PageProps } from './$types';
import AddEventModal from './AddEventModal.svelte';
import { eventNames } from './events.shared';

let { data }: PageProps = $props();

const eventsList = $derived(data.eventsList ?? null);

let isAddEventOpen = $state(false);
let userFilter = $state<string[]>([]);
let eventFilter = $state<string[]>([]);

const userOptions = $derived.by(() => {
	if (eventsList === null) {
		return [];
	}

	const authors = new Map<string, GuildEventAuthor>();
	for (const item of eventsList) {
		if (item.author) {
			authors.set(item.author.id, item.author);
		}
	}

	return [...authors.values()]
		.sort((a, b) => a.username.localeCompare(b.username))
		.map(
			(author): SelectOption => ({
				value: author.id,
				label: author.username,
				meta: author
			})
		);
});

const eventOptions: SelectOption[] = Object.entries(eventNames).map(([value, label]) => ({
	value,
	label
}));

const filteredEventsList = $derived(
	eventsList === null
		? null
		: eventsList.filter(
				(item) =>
					(userFilter.length === 0 ||
						(item.author != null && userFilter.includes(item.author.id))) &&
					(eventFilter.length === 0 || eventFilter.includes(item.event))
			)
);
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

{#snippet userOptionContent(item: SelectOption)}
  {@const author = item.meta as GuildEventAuthor}
  {#if author.avatar_url}
    <img class="option-avatar" src={author.avatar_url} alt="" />
  {:else}
    <span class="option-avatar option-placeholder" aria-hidden="true"
      >{author.username?.[0]?.toUpperCase() ?? "?"}</span
    >
  {/if}
  <span class="option-label">{author.username}</span>
{/snippet}

<div class="actions">
  <div class="filters">
    <Select options={userOptions} bind:values={userFilter} placeholder="Все пользователи">
      {#snippet option(item)}
        {@render userOptionContent(item)}
      {/snippet}
    </Select>
    <Select options={eventOptions} bind:values={eventFilter} placeholder="Все события" multiple />
  </div>
  <Button onclick={() => (isAddEventOpen = true)}>Добавить свой</Button>
</div>

{#if filteredEventsList === null}
  <p>Не удалось загрузить список событий.</p>
{:else if filteredEventsList.length === 0}
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
        {#each filteredEventsList as item (item.id)}
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
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 1rem;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .option-avatar {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    object-fit: cover;
    background-color: var(--color-bg);
    flex: 0 0 auto;
  }

  .option-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    font-size: 11px;
    font-weight: 700;
  }

  .option-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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
