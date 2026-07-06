<script lang="ts">
import { page } from '$app/state';
import { setAuth } from '$lib/auth/auth.store.svelte';

let { children } = $props();

$effect(() => {
	const a = page.data.auth;

	if (a !== undefined) {
		setAuth(a);
	}
});
</script>

{@render children()}
