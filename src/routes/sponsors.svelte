<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '$lib/components/Badge.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import { sponsors } from '$lib/sponsors';

	function sponsorClass(index: number): string {
		switch (index + 1) {
			case 1:
				return ' amount--gold';
			case 2:
				return ' amount--silver';
			case 3:
				return ' amount--bronze';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://cdn.discordapp.com" />
</svelte:head>

<MetaTags
	noindex={true}
	nofollow={true}
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

<Banner
	role=""
	title="Возможность внести свою лепту"
	image="/placeholders/sponsors.jpg"
	imageAlt="Поддержи RGD"
	imageBGColor="#343438"
	href="https://donatty.com/rgd"
	rel="external"
>
	Основной способ поддержать Russian Gamedev —
	<a rel="external" href="https://donatty.com/rgd"> Donatty </a>
	<ButtonLink slot="button" class="sponsor-icon" rel="external" href="https://donatty.com/rgd">
		Поддержать
	</ButtonLink>
</Banner>

<div class="sponsors">
	<h3>Поддержавшие</h3>

	<div class="sponsors__list">
		{#each sponsors as sponsor, index}
			<div class="sponsor">
				<a class="profile" href="#ass">
					<img
						src="https://cdn.discordapp.com/avatars/281037696225247233/7fc45e72e599ddf519ffba81538dd380.jpg?size=64"
						alt=""
					/>
					<span class="name">{sponsor.name}</span>
				</a>
				<Badge class={'amount' + sponsorClass(index)}>
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
	:global(.sponsor-icon) {
		padding: 0.6rem 0.8rem 0.6rem 1rem;
	}

	:global(.sponsor-icon::after) {
		margin-left: 0.4rem;
		width: 1.2rem;
		height: 1.2rem;
		content: url('/icons/dollar-sign.svg');
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
			background-color: var(--secondary-background);

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
					font-weight: 700;
					line-height: 1.2rem;
				}
			}

			:global(.amount) {
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
