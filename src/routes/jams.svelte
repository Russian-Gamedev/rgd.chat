<script lang="ts">
	import type { Jam } from '$lib/types';
	import { jams, href } from '$lib/jams';
	import Badge from '$lib/components/Badge.svelte';
	let jam = jams[0];
</script>

<svelte:head>
	<title>Джемы на RGD</title>
</svelte:head>

<div role="article" class="banner" title={jam.title}>
	<!-- Also, maybe wrap it into `figure` for semantics? -->
	<img src={jam.thumbnail} alt={jam.thumbnailAlt} />
	<div class="banner__content">
		<div class="banner__content__info">
			<h1 class="title">{jam.title}</h1>
			<p class="teaser">{jam.teaser}</p>
		</div>
		<a class="banner__content__link" href={href(jam)}> Подробнее </a>
	</div>
</div>

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
	.banner {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		border-radius: 0.4rem;
		padding: 0.8rem;
		overflow: hidden;
		text-decoration: none;
		background-color: var(--secondary-color);

		img {
			margin: 0;
			object-fit: cover;
			width: 100%;
			aspect-ratio: 3 / 1;
			border-radius: 0.2rem;
			background: #648ce8;
		}

		&__content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 2rem;

			&__info {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;

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
			}

			&__link {
				display: flex;
				align-items: center;
				padding: 0.4rem 0.6rem 0.4rem 0.8rem;
				background-color: var(--primary);
				border-radius: 0.4rem;
				font-size: 0.85rem;
				font-weight: 500;
				line-height: 1.2rem;
				color: var(--pure-white);

				&:hover {
					text-decoration: none;
				}

				&::after {
					margin-left: 0.4rem;
					width: 1.2rem;
					height: 1.2rem;
					content: url('/icons/chevron-right.svg');
				}
			}
		}
	}

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
				font-weight: 500;
			}

			.teaser {
				font-size: 0.7rem;
				color: var(--dimmed-text-color);
			}
		}
	}
</style>
