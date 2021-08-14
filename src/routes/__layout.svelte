<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../global.css';
</script>

<Header />

<main>
	<slot />
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 40rem;
		margin: 0 auto;
		box-sizing: content-box;
		color: var(--text-color);
	}
</style>
