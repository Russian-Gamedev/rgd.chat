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

<div class="jams">
	<h3>Джемы</h3>
	<div class="jams__list">
		{#each jams.slice(1, jams.length) as jam}
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
	</div>
</div>

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
		background: #648ce8;
	}

	.banner__info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
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
	}

	.banner__link a {
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 1.2rem;
		color: var(--pure-white);
	}

	.jams {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.jams__list {
		display: flex;
		flex-wrap: wrap;
		column-gap: 2.4rem;
		row-gap: 1.6rem;
	}

	.jam {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-basis: 15.2rem;
		/* flex-grow: 1; */
		box-sizing: border-box;
		gap: 0.8rem;
		border-radius: 0.4rem;
		padding: 0.8rem;
		overflow: hidden;
		text-decoration: none;
		background-color: var(--secondary-color);
	}

	.jam img {
		margin: 0;
		object-fit: cover;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.2rem;
	}

	.badges {
		position: absolute;
		top: 0;
		right: 0;
		margin: 1.5rem 1.2rem;
		display: flex;
		justify-content: flex-end;
		color: var(--pure-white);
	}

	.badge {
		display: block;
		padding: 0.1rem 0.4rem;
		font-size: 0.5rem;
		font-weight: 500;
		line-height: 0.8rem;
		letter-spacing: 0.025rem;
		border-radius: 2em;
		background-color: var(--secondary-background);
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
