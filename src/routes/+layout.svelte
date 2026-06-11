<script lang="ts">
import { deepMerge, MetaTags } from 'svelte-meta-tags';

import favicon from '$lib/assets/favicon.svg';
import '../styles/globals.css';
import { page } from '$app/state';

import type { LayoutProps } from './$types';
import Navbar from './navbar.svelte';

let { children, data }: LayoutProps = $props();

const metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));
const themeColor = $derived(data.themeColor);
</script>

<MetaTags {...metaTags} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content={themeColor} />
	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="language" content="Russian" />
</svelte:head>

<div class="root">
	<Navbar />
	<main>
		{@render children()}
	</main>
</div>

<style>
	.root {
		display: flex;
		min-height: 100vh;
	}

	main {
		flex: 1;
		min-width: 0;
		padding: 64px 40px;
	}

	@media (max-width: 767px) {
		.root {
			flex-direction: column;
		}

		main {
			padding: 24px 16px;
		}
	}
</style>
