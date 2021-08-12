<script>
	export let jams = [
		{
			title: 'Some shit',
			image: 'https://via.placeholder.com/160x90.png',
			href: '/jam/123'
		}
	];
</script>

<svelte:head>
	<title>Джемы на RGD</title>
</svelte:head>

{#each jams as jam}
	<a href={jam.href}>
		<figure>
			<img src={jam.image} alt="" />
			<figcaption />
		</figure>
		{jam.title}</a
	>
{/each}
