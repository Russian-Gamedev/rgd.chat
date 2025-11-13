<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/globals.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main>
	{@render children()}
</main>

<style>
	main {
		max-width: 800px;
		padding: 64px 40px;
	}
</style>
