<script lang="ts">
import { onMount } from 'svelte';

import { createApi } from '$lib/api/api';
import type { MotdListItem } from '$lib/api/api.type';
import { IconHash } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

let user = $state<unknown>(null);
let motdList = $state<MotdListItem[] | null>(null);
let isLoading = $state(true);

	onMount(() => {
		const api = createApi({ fetch });

		api.getMe()
			.then((u) => {
				user = u;
				return api.getMotdList();
			})
			.then((res) => {
				motdList = Array.isArray(res) ? res : (res.motdList ?? null);
			})
			.catch(() => {
				if (!user) {
					window.location.href = import.meta.env.VITE_AUTH_URL;
				}
			})
			.finally(() => {
				isLoading = false;
			});
	});
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

{#if isLoading}
  <p>Загрузка...</p>
{:else if motdList === null}
  <p>Не удалось загрузить список сообщений.</p>
{:else if motdList.length === 0}
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
        {#each motdList as item (item.id)}
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

  .table-wrapper {
    overflow-x: auto;
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
