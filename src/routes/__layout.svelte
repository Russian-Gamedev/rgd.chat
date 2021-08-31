<script>
	import Header from '$lib/components/Header.svelte';
	import '../global.css';
</script>

<Header />

<div class="content">
	<!-- Breadcrumbs -->

	<main>
		<slot />
	</main>

	<!-- Footer -->
</div>

<style>
	.content {
		margin: 0 auto;
		height: 100%;
		max-width: 50.4rem;
		box-sizing: content-box;
		padding: 3.2rem 2rem;
		color: var(--text-color);
	}

	.content,
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: flex-start;
		gap: 2.4rem;
	}
</style>
