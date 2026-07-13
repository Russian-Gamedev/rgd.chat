<script lang="ts">
import { invalidate } from '$app/navigation';
import { page } from '$app/state';
import { ApiHttpError, createApi } from '$lib/api/api';
import { requireAuth } from '$lib/auth/auth.actions';
import { hasGlobalPermission } from '$lib/auth/permissions';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';

import type { PageProps } from './$types';

let { data }: PageProps = $props();
requireAuth(page.data.auth);
const canReview = $derived(hasGlobalPermission(page.data.auth, 'games:review'));
const api = createApi({ fetch });
let tags = $state<typeof data.tags extends Array<infer T> | null ? T[] : never[]>([]);
let search = $state('');
let dialog = $state<'create' | 'edit' | null>(null);
let selectedId = $state<string | null>(null);
let name = $state('');
let isMutating = $state(false);

const filtered = $derived(
	tags.filter((tag) =>
		`${tag.name} ${tag.slug} ${tag.id}`.toLowerCase().includes(search.toLowerCase())
	)
);

function openCreate() {
	selectedId = null;
	name = '';
	dialog = 'create';
}
function openEdit(tag: (typeof tags)[number]) {
	selectedId = tag.id;
	name = tag.name;
	dialog = 'edit';
}

async function save() {
	if (!name.trim() || isMutating || (dialog === 'edit' && !selectedId)) return;
	isMutating = true;
	try {
		const mode = dialog;
		const next =
			mode === 'create'
				? await api.createTag(name.trim())
				: await api.updateTag(selectedId as string, name.trim());
		tags =
			dialog === 'create' ? [...tags, next] : tags.map((tag) => (tag.id === next.id ? next : tag));
		await invalidate('games:tags');
		dialog = null;
		showSnackbar({
			message: mode === 'create' ? 'Тег создан.' : 'Тег изменён.',
			variant: 'success'
		});
	} catch (error) {
		showSnackbar({
			message:
				error instanceof ApiHttpError && error.status === 409
					? 'Тег уже используется или конфликтует с существующим.'
					: 'Не удалось сохранить тег.',
			variant: 'error'
		});
	} finally {
		isMutating = false;
	}
}

async function remove(id: string) {
	if (isMutating || !confirm('Удалить тег? Backend удалит только неиспользуемый тег.')) return;
	isMutating = true;
	try {
		await api.deleteTag(id);
		tags = tags.filter((tag) => tag.id !== id);
		await invalidate('games:tags');
		showSnackbar({ message: 'Тег удалён.', variant: 'success' });
	} catch (error) {
		showSnackbar({
			message:
				error instanceof ApiHttpError && error.status === 409
					? 'Нельзя удалить тег, пока он используется играми.'
					: 'Не удалось удалить тег.',
			variant: 'error'
		});
	} finally {
		isMutating = false;
	}
}
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Модерация', href: '/admin/games' }, { label: 'Теги', href: '' }]} />
{#if !canReview}<section class="state"><h1>403</h1><p>Для управления тегами требуется permission games:review.</p></section>
{:else}<div class="header"><div><h1>Каталог тегов</h1><p>Изменение имени пересоздаёт slug и может сломать сохранённые ссылки `/games?tag=old-slug`.</p></div><Button onclick={openCreate}>Создать тег</Button></div><input class="search" bind:value={search} placeholder="Поиск по имени, slug или ID" />{#if data.tags === null}<section class="state"><h2>Не удалось загрузить теги</h2><Button as="a" href="/admin/games/tags">Повторить</Button></section>{:else}<div class="table-wrap"><table><thead><tr><th>Имя</th><th>Slug</th><th>ID</th><th></th></tr></thead><tbody>{#each filtered as tag (tag.id)}<tr><td>{tag.name}</td><td>{tag.slug}</td><td>{tag.id}</td><td><Button variant="outline" onclick={() => openEdit(tag)}>Изменить</Button><Button color="error" variant="outline" disabled={isMutating} onclick={() => remove(tag.id)}>Удалить</Button></td></tr>{/each}</tbody></table></div>{/if}
<Modal open={dialog !== null} title={dialog === 'create' ? 'Создать тег' : 'Изменить тег'} onClose={() => (dialog = null)}><label>Имя<input bind:value={name} maxlength="80" /></label>{#if dialog === 'edit'}<p class="warning">Slug будет пересоздан из нового имени.</p>{/if}<div class="modal-actions"><Button disabled={isMutating || !name.trim()} onclick={save}>Сохранить</Button></div></Modal>{/if}

<style>
	.header, .modal-actions { align-items: center; display: flex; gap: 1rem; justify-content: space-between; } .header { margin: 1.5rem 0; } h1, p { margin-top: 0; } .header p, .warning { color: var(--color-warning); } .search, input { background: var(--color-bg-surface); border: 1px solid #303238; border-radius: .4rem; color: inherit; font: inherit; padding: .6rem; } .search { margin-bottom: 1rem; width: min(30rem, 100%); } .table-wrap { overflow-x: auto; } table { border-collapse: collapse; min-width: 700px; width: 100%; } th, td { border-bottom: 1px solid #303238; padding: .75rem; text-align: left; } td:last-child { display: flex; flex-wrap: wrap; gap: .5rem; } label { display: grid; gap: .35rem; } .state { background: var(--color-bg-surface); border-radius: .65rem; padding: 2rem; text-align: center; }
</style>
