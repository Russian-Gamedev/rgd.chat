<script>
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
		justify-content: start;
		align-items: flex-start;
		gap: 2.4rem;
		margin: 0 auto;
		padding: 3.2rem 2rem;
		box-sizing: content-box;
		width: 100%;
		/* 1040 px */
		max-width: 52rem;
		height: 100%;
		color: var(--text-color);
	}
</style>
