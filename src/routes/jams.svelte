<script lang="ts">
	import type { Jam } from '$lib/types';
	import { jams, href } from '$lib/jams';
</script>

<svelte:head>
	<title>Джемы на RGD</title>
</svelte:head>

<div class="jams">
	{#each jams as jam}
		<a role="article" class="jam" title={jam.title} href={href(jam)}>
			<!-- 16x9 image -->
			<!-- Also, maybe wrap it into `figure` for semantics? -->
			<img src={jam.thumbnail} alt={jam.thumbnailAlt} />
			<div class="info">
				<h1 class="title">{jam.title}</h1>
				<p class="teaser">{jam.teaser}</p>
			</div>
		</a>
	{/each}
</div>

<style>
	.jams {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		gap: 1.5rem;
	}

	.jam {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		background-color: var(--secondary-color);
		border-radius: 0.4rem;
		overflow: hidden;
	}

	img {
		margin: 0;
		object-fit: cover;
		width: 100%;
		aspect-ratio: 16 / 9;
	}

	.info {
		padding: 1.5rem;
		padding-top: 1rem;
	}

	.title {
		margin: 0;
		font-size: 1em;
		line-height: 1.6em;
		font-weight: bold;
		letter-spacing: 0.03em;
		text-align: start;
		color: var(--heading-color);
	}

	.teaser {
		font-size: 0.85em;
	}

	.title,
	.teaser {
		line-height: 1.6em;
	}

	.teaser {
		margin: 0;
		color: var(--dimmed-text-color);
	}
</style>
