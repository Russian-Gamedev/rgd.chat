<script>
	export let jams = [
		{
			title: 'Some shit',
			href: '/jam/123'
		}
	];
</script>

<svelte:head>
	<title>Джемы</title>
</svelte:head>

{#each jams as jam}
	<a href={jam.href}>{jam.title}</a>
{/each}
