<script lang="ts">
	import type { Jam } from '$lib/types';
	import { jams, href } from '$lib/jams';
	let jam = jams[0];
</script>

<svelte:head>
	<title>Джемы на RGD</title>
</svelte:head>

<div role="article" class="banner" title={jam.title}>
	<!-- Also, maybe wrap it into `figure` for semantics? -->
	<img src={jam.thumbnail} alt={jam.thumbnailAlt} />
	<div class="banner__info">
		<div class="info">
			<h1 class="title">{jam.title}</h1>
			<p class="teaser">{jam.teaser}</p>
		</div>
		<div class="banner__link"><a href={href(jam)}> Подробнее </a></div>
	</div>
</div>

{#each jams as jam}
	<a role="article" class="jam" title={jam.title} href={href(jam)}>
		<div class="badges">
			<span class="badge"> ЛЕТО 2021 </span>
		</div>
		<img src={jam.thumbnail} alt={jam.thumbnailAlt} />
		<div class="jam__info">
			<h1 class="title">{jam.title}</h1>
			<p class="teaser">{jam.teaser}</p>
		</div>
	</a>
{/each}

<style>
	.banner {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		border-radius: 0.4rem;
		padding: 0.8rem;
		overflow: hidden;
		text-decoration: none;
		background-color: var(--secondary-color);
	}

	.banner img {
		margin: 0;
		object-fit: cover;
		width: 100%;
		aspect-ratio: 3 / 1;

		border-radius: 0.2rem;
		--smooth-corners: 300, 100;
		mask-image: paint(smooth-corners);
		-webkit-mask-image: paint(smooth-corners);
	}

	.banner__info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.banner__info .info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.banner__link {
		display: flex;
		align-items: center;
		padding: 0.4rem 0.6rem 0.4rem 0.8rem;
		background-color: var(--primary);

		border-radius: 0.4rem;
		--smooth-corners: 300, 100;
		mask-image: paint(smooth-corners);
		-webkit-mask-image: paint(smooth-corners);
	}

	.banner__link a {
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 1.2rem;
		color: var(--pure-white);
	}

	.title,
	.teaser {
		line-height: 1.2rem;
		margin: 0;
	}

	.title {
		font-size: 0.7rem;
		font-weight: 500;
	}

	.teaser {
		font-size: 0.7rem;
		color: var(--dimmed-text-color);
	}
</style>
