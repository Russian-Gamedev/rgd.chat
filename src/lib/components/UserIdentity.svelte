<script lang="ts">
import { createApi } from '$lib/api/api';
import type { User } from '$lib/api/api.type';

let { id, compact = false }: { id: string; compact?: boolean } = $props();
let profile = $state<User | null>(null);
let failed = $state(false);

const cache = UserIdentityCache;

$effect(() => {
	const value = id.trim();
	if (!value) return;
	const cached = cache.get(value);
	if (cached) {
		cached.then((next) => (profile = next));
		return;
	}
	const request = createApi({ fetch })
		.getUser(value)
		.then((next) => next)
		.catch(() => null);
	cache.set(value, request);
	request.then((next) => (profile = next));
});

const displayName = $derived(profile?.nickname || profile?.username || id);
const initials = $derived(displayName.slice(0, 1).toUpperCase());
</script>

<span class:compact class="identity" title={id}>
	{#if profile && profile.avatarUrl && !failed}
		<img src={profile.avatarUrl} alt="" onerror={() => (failed = true)} />
	{:else}<span class="avatar-fallback">{initials}</span>{/if}
	<span class="name">{displayName}</span>
	{#if !compact || !profile}<small>{id}</small>{/if}
</span>

<script module lang="ts">
	const UserIdentityCache = new Map<string, Promise<import('$lib/api/api.type').User | null>>();
</script>

<style>
	.identity { align-items: center; display: inline-flex; gap: .5rem; min-width: 0; vertical-align: middle; }
	.identity img, .avatar-fallback { align-items: center; background: var(--color-bg); border-radius: 50%; display: inline-flex; flex: 0 0 auto; height: 2rem; justify-content: center; object-fit: cover; width: 2rem; }
	.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	small { color: var(--color-text-secondary); font-size: .75rem; }
	.compact img, .compact .avatar-fallback { height: 1.5rem; width: 1.5rem; }
</style>
