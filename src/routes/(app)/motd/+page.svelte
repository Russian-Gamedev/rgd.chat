<script lang="ts">
import type { MotdListItem } from '$lib/api/api.type';
import { IconHash } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Link from '$lib/components/Link.svelte';
import Select, { type SelectOption } from '$lib/components/Select.svelte';

import type { PageProps } from './$types';
import AddMotdModal from './AddMotdModal.svelte';

let { data }: PageProps = $props();

const motdList = $derived(data.motdList);

let isAddMotdOpen = $state(false);
let userFilter = $state<string[]>([]);

const userOptions = $derived.by(() => {
	if (motdList === null) {
		return [];
	}

	const users = new Map<string, MotdListItem['user']>();
	for (const item of motdList) {
		users.set(item.user.id, item.user);
	}

	return [...users.values()]
		.sort((a, b) => a.username.localeCompare(b.username))
		.map(
			(user): SelectOption => ({
				value: user.id,
				label: user.username,
				meta: user
			})
		);
});

const filteredMotdList = $derived(
	motdList === null || userFilter.length === 0
		? motdList
		: motdList.filter((item) => item.user.id === userFilter[0])
);
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "MOTD", href: "/motd" },
  ]}
/>

<div class="header">
  <span class="header-icon"><IconHash /></span>
  <h1>Сообщения дня</h1>
</div>

<p class="description">
  Всякие смешнявки в статусе бота, которые меняются каждую минуту
</p>

<p class="description">
  Вы можете добавить свои через кнопку ниже, в дискорд боте на сервере через
  <code>/motd add</code> либо добавить скриптовый на
  <Link
    href="https://github.com/Russian-Gamedev/bot.rgd.chat/blob/main/src/core/guilds/motd/runtime-motds.ts"
    >гитхабе</Link
  >
</p>

{#snippet userOptionContent(item: SelectOption)}
  {@const user = item.meta as MotdListItem['user']}
  {#if user.avatar_url}
    <img class="option-avatar" src={user.avatar_url} alt="" />
  {:else}
    <span class="option-avatar option-placeholder" aria-hidden="true"
      >{user.username?.[0]?.toUpperCase() ?? "?"}</span
    >
  {/if}
  <span class="option-label">{user.username}</span>
{/snippet}

<div class="actions">
  <Select options={userOptions} bind:values={userFilter} placeholder="Все пользователи">
    {#snippet option(item)}
      {@render userOptionContent(item)}
    {/snippet}
  </Select>
  <Button onclick={() => (isAddMotdOpen = true)}>Добавить свой</Button>
</div>

{#if filteredMotdList === null}
  <p>Не удалось загрузить список сообщений.</p>
{:else if filteredMotdList.length === 0}
  <p>Сообщения не найдены.</p>
{:else}
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Пользователь</th>
          <th>Сообщение</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredMotdList as item (item.id)}
          <tr>
            <td class="id-cell">{item.id}</td>
            <td>
              <div class="user-cell">
                <img
                  class="user-avatar"
                  src={item.user.avatar_url}
                  alt={item.user.username}
                />
                <span>{item.user.username}</span>
              </div>
            </td>
            <td>{item.content}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<AddMotdModal open={isAddMotdOpen} onClose={() => (isAddMotdOpen = false)} />

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

  .id-cell {
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
    width: 60px;
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

  tbody tr:hover {
    background-color: color-mix(in srgb, var(--color-primary) 6%, transparent);
  }
</style>
