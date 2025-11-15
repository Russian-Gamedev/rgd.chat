<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { deepMerge, MetaTags } from 'svelte-meta-tags';
	import '../styles/globals.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { children, data }: LayoutProps = $props();

	// This will be reactive and update when child pages provide their own metadata
	const { ...metaTags } = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));
	const { themeColor } = data;
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

<main>
	{@render children()}
</main>

<style>
	main {
		padding: 64px 40px;
	}
</style>
