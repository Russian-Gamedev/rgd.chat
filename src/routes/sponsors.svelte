<script lang="ts">
	import { page } from '$app/stores';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import Badge from '$lib/components/Badge.svelte';

	import { sponsors } from '$lib/sponsors';

	function sponsorClass(index: number): string {
		let result = 'amount';
		switch (index + 1) {
			case 1:
				return result + ' amount--gold';
			case 2:
				return result + ' amount--silver';
			case 3:
				return result + ' amount--bronze';
			default:
				return result;
		}
	}
</script>

<!-- <svelte:head>
	<title>Донатеры</title>
	<meta property="og:site_name" content="Russian Gamedev" />
	<meta property="og:title" content="Донатеры" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ru_RU" />
	<meta property="og:url" content={page.toString()} />
	<meta property="og:image" content="https://ia.media-imdb.com/images/rock.jpg" />
</svelte:head> -->

<MetaTags
	title="Донатеры"
	openGraph={{
		site_name: 'Russian Gamedev',
		title: 'Донатеры',
		description: 'Список поддержавших сервер',
		type: 'website',
		locale: 'ru_RU',
		url: 'https://' + $page.host + $page.path,
		images: [
			{
				url: 'https://' + $page.host + '/placeholders/sponsors.jpg'
			}
		]
	}}
/>

<div class="banner" title="Поддержи RGD">
	<!-- Also, maybe wrap it into `figure` for semantics? -->
	<img src="/placeholders/sponsors.jpg" alt="Поддержи RGD" />
	<div class="banner__content">
		<div class="banner__content__info">
			<h1 class="title">Возможность внести свою лепту</h1>
			<p class="teaser">
				Основной способ поддержать Russian Gamedev —
				<a rel="external" href="https://donatty.com/rgd"> Donatty </a>
			</p>
		</div>
		<a class="banner__content__link" rel="external" href="https://donatty.com/rgd"> Поддержать </a>
	</div>
</div>

<div class="sponsors">
	<h3>Поддержавшие</h3>

	<div class="sponsors__list">
		{#each sponsors as sponsor, index}
			<div class="sponsor">
				<a class="profile" href="#ass">
					<img src="/placeholders/profile.jpg" alt={'Аватар' + sponsor.name} />
					<span class="name">{sponsor.name}</span>
				</a>
				<Badge class={sponsorClass(index)}>
					{sponsor.amount.toLocaleString('ru-RU', {
						style: 'currency',
						currency: 'RUB',
						maximumFractionDigits: 0,
						minimumFractionDigits: 0
					})}
				</Badge>
			</div>
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

	.sponsors {
		display: flex;
		row-gap: 1.2rem;
		flex-direction: column;

		&__list {
			display: flex;
			flex-wrap: wrap;
			column-gap: 2.4rem;
			row-gap: 1.6rem;
		}

		.sponsor {
			flex: 1 0 15.2rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.4rem;
			padding: 0.8rem;
			box-sizing: border-box;
			border-radius: 0.4rem;
			background-color: var(--secondary-color);

			.profile {
				display: flex;
				align-items: center;
				gap: 0.4rem;
				color: var(--pure-white);

				&:hover {
					text-decoration: none;
				}

				&:visited {
					color: var(--pure-white);
				}

				img {
					width: 1.4rem;
					height: 1.4rem;
					border-radius: 0.45rem;
				}

				.name {
					font-size: 0.7rem;
					font-weight: 500;
					line-height: 1.2rem;
				}
			}

			:global(.amount) {
				font-variant-numeric: tabular-nums;
				background-color: var(--primary);
			}

			:global(.amount--gold) {
				background-color: #deb259;
			}

			:global(.amount--silver) {
				background-color: #9fa7ab;
			}

			:global(.amount--bronze) {
				background-color: #de9c65;
			}
		}
	}
</style>
