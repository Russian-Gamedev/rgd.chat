<script lang="ts">
import { browser } from '$app/environment';
import { page } from '$app/state';
import { setAuth } from '$lib/auth/auth.store.svelte';

let { children } = $props();

$effect(() => {
	const a = page.data.auth;

	if (a !== undefined) {
		setAuth(a);
	}

	if (browser && a === null) {
		window.location.href = import.meta.env.VITE_AUTH_URL;
	}
});
</script>

{#if page.data.auth}
  {@render children()}
{/if}
