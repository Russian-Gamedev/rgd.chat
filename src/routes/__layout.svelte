<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../global.css';
</script>

<Header />

<main>
	<slot />
</main>

<!-- TODO: Remove when adaptive design become real thing -->
<div class="todo"><h3>Здесь мог быть ваш адаптивный дизайн</h3></div>

<style>
	.todo {
		display: none;
		overflow: hidden;
	}

	/* Adaptive design should do it's thing on 960px */
	/* @media (max-width: 960px) { */
	/* This media query needed for a joke */
	@media (max-width: 870px) {
		main,
		:global(header) {
			display: none !important;
		}

		.todo {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: absolute;
			width: 100%;
			height: 100%;
			color: var(--pure-white);
			background-color: var(--accent-color);
		}

		.todo::before {
			content: url('/icons/poop.svg');
			min-width: 4rem;
			min-height: 4rem;
		}
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 3.2rem 2rem;
		width: 100%;
		/* 1040 px */
		/* max-width: 52rem; */
		max-width: 50.4rem;
		margin: 0 auto;
		box-sizing: content-box;
		color: var(--text-color);
	}
</style>
