<script lang="ts">
	import ExternalLink from '$lib/assets/icons/external-link.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Button from '$lib/components/Button.svelte';
	import Tertiary from '$lib/components/Tertiary.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { stats, cards } = data;
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }]} />

<h1>Russian Gamedev — Discord сообщество</h1>

<p class="description">
	Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте
	отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых
	участников и играем в игры.
</p>

<div class="badges">
	<Badge label="Участников" count={stats.total} />
	<Badge label="Онлайн" count={stats.online} />
</div>

<Button
	as="a"
	class="join-button"
	href="https://join.rgd.chat"
	target="_blank"
	data-rybbit-event="join_discord"
>
	Присоединиться
	<ExternalLink />
</Button>

<section class="links">
	<Tertiary label="Полезные ссылки" />
	<div class="cards">
		{#each cards as card}
			<a
				href={card.link}
				target="_blank"
				rel="noopener noreferrer"
				class="card"
				data-rybbit-event="click_card"
				data-rybbit-prop-card={card.title}
			>
				<div class="card-icon">
					<card.icon />
				</div>
				<h4 class="card-title">{card.title}</h4>
				<p class="card-description">{card.description}</p>
			</a>
		{/each}
	</div>
</section>

<style>
	:global(.join-button) {
		font-weight: bold;
		font-size: 20px;
		margin: 24px 0;
	}

	.links {
		margin-top: 48px;
	}

	.cards {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		row-gap: 2rem;
		margin-bottom: 3rem;
		margin-top: 1.5rem;
	}

	.card {
		padding: 1rem;
		background-color: var(--color-bg-surface);
		border-radius: 0.5rem;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		flex: 1;
		text-decoration: none;
		transition: transform 500ms;
		color: var(--color-text);

		&:hover {
			transform: translateY(-0.25rem);
		}
	}

	.card-icon {
		color: #fff;
		background-color: var(--color-primary);
		border-radius: 0.75rem;
		padding: 0.625rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		margin-bottom: 1rem;
	}

	.card-title {
		font-weight: 700;
		font-size: 0.875rem;
		line-height: 1.5rem;
		margin: 0;
	}
	.card-description {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		line-height: 1.5rem;
		margin-bottom: 0;
	}

	.badges {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
