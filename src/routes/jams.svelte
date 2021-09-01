<script lang="ts">
	import { jams, href } from '$lib/jams';
	import Badge from '$lib/components/Badge.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import MetaTags from '$lib/components/MetaTags.svelte';
	let jam = jams[0];
</script>

<MetaTags noindex={true} nofollow={true} title="Джемы" />

<Banner
	role="article"
	title={jam.title}
	image={jam.thumbnail}
	imageBGColor="#648ce8"
	imageAlt={jam.thumbnailAlt}
	teaser={jam.teaser}
	href={href(jam)}
/>

<div class="jams">
	<h3>Джемы</h3>

	<div class="jams__list">
		{#each jams.slice(1, jams.length) as jam}
			<a role="article" class="jam" title={jam.title} href={href(jam)}>
				<div class="jam__badges">
					<Badge>ЛЕТО 2021</Badge>
				</div>
				<img src={jam.thumbnail} alt={jam.thumbnailAlt} />
				<div>
					<h1 class="title">{jam.title}</h1>
					<p class="teaser">{jam.teaser}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	.jams {
		display: flex;
		flex-direction: column;
		row-gap: 1.2rem;

		&__list {
			display: flex;
			flex-wrap: wrap;
			column-gap: 2.4rem;
			row-gap: 1.6rem;
		}

		.jam {
			flex: 0 1 15.2rem;
			position: relative;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			gap: 0.8rem;
			border-radius: 0.4rem;
			padding: 0.8rem;
			overflow: hidden;
			text-decoration: none;
			background-color: var(--secondary-color);

			@media (max-width: 1028px) {
				& {
					flex-grow: 1;
				}
			}

			img {
				margin: 0;
				object-fit: cover;
				width: 100%;
				aspect-ratio: 16 / 9;
				border-radius: 0.2rem;
			}

			&__badges {
				position: absolute;
				top: 0;
				right: 0;
				margin: 1.5rem 1.2rem;
				display: flex;
				justify-content: flex-end;
			}

			.title,
			.teaser {
				line-height: 1.2rem;
				margin: 0;
			}

			.title {
				font-size: 0.7rem;
				font-weight: 700;
			}

			.teaser {
				font-size: 0.7rem;
				color: var(--dimmed-text-color);
			}
		}
	}
</style>
