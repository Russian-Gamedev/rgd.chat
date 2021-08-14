<script>
	export let jams = [
		{
			title: 'KOJIMA-ДЖЕМ на Russian Gamedev',
			teaser:
				'Админы копили с обедов, воровали, попрошайничали на конфэ джиди (э фэйерли комьюнити оф гейм девелопмент) и всё-таки накопили на джем!',
			timestamp: '05 мая 2020',
			preview: 'https://via.placeholder.com/160x90.png',
			previewDescription: 'Анонс джема весеннего сезона 2020 года',
			href: '/jam/123'
		}
	];
</script>

<svelte:head>
	<title>Джемы на RGD</title>
</svelte:head>

{#each jams as jam}
	<a role="article" class="jam" href={jam.href}>
		<!-- 16x9 image -->
		<figure class="jam__image">
			<img src={jam.preview} alt={jam.previewDescription} />
		</figure>
		<h1 class="jam__title">{jam.title}</h1>
		<p class="jam__teaser">{jam.description}</p>
	</a>
{/each}

<style>
	.jam {
		display: flex;
		flex-direction: column;
		background-color: var(--secondary-color);
	}
</style>
