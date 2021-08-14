<script lang="ts">
	import type { Jam } from '$lib/jam';
	import { href } from '$lib/jam';
	export let jams: Jam[] = [
		{
			id: 123,
			title: 'KOJIMA-ДЖЕМ — Тема: HIDEOKOJIMA GAME',
			teaser:
				'Админы копили с обедов, воровали, попрошайничали на конфэ джиди (э фэйерли комьюнити оф гейм девелопмент) и всё-таки накопили на джем!',
			date: '10-13 октября 2019',
			budget: 10000,
			thumbnail: 'https://img.youtube.com/vi/f5w1S53cvQU/maxresdefault.jpg',
			thumbnailAlt: 'Анонс джема весеннего сезона 2020 года'
		}
	];
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
				<div class="header">
					<div class="details">
						<span class="date" aria-label="Дата проведения джема">
							{jam.date}
						</span>
						<span class="budget" aria-label="Сумма разделённая между победителями">
							{jam.budget.toLocaleString('ru-RU', {
								style: 'currency',
								currency: 'RUB',
								maximumFractionDigits: 0
							})}
						</span>
					</div>
					<ul class="buttons">
						<li class="button">
							<a
								class="button__link"
								title="Перейти к участникам джема"
								rel="bookmark"
								href={href(jam) + '#Участники'}
							>
								Участники
							</a>
						</li>
						<li class="button">
							<a
								class="button__link"
								title="Перейти к победителям джема"
								rel="bookmark"
								href={href(jam) + '#Победители'}
							>
								Победители
							</a>
						</li>
						<li class="button">
							<a
								class="button__link"
								title="Перейти к стриму по джему"
								rel="bookmark"
								href={href(jam) + '#Стрим'}
							>
								Стрим
							</a>
						</li>
					</ul>
				</div>
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
		gap: 1.5rem;
	}

	.jam {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		background-color: var(--secondary-color);
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

	.header {
		display: flex;
		height: 1.5rem;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.details,
	.date,
	.budget {
		display: flex;
		align-items: center;
		/* letter-spacing: 0.01em; */
		gap: 0.5rem;
		color: var(--dimmed-text-color);
	}

	.details {
		flex-shrink: 0;
		gap: 1rem;
	}

	.date::before {
		content: url('/icons/date.svg');
		width: 1rem;
		height: 1rem;
	}

	.budget::before {
		content: url('/icons/coins.svg');
		width: 1rem;
		height: 1rem;
	}

	.buttons {
		display: flex;
		margin: 0;
		padding: 0;
		list-style: none;
		gap: 1.25rem;
	}

	.button__link {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		text-transform: uppercase;
		font-weight: bold;
		letter-spacing: 0.03em;
		color: var(--text-color);
		transition: color 0.1s ease-in-out;
	}

	.button__link:hover {
		text-decoration: none;
		color: var(--accent-color);
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

	.details > *,
	.button__link,
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
