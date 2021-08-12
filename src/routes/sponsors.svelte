<script lang="ts">
	let sponsors = [
		{
			name: 'Terisback',
			amount: '23 630 рублёв'
		}
	];
</script>

<svelte:head>
	<title>Спонсоры сервера</title>
</svelte:head>

<ul>
	{#each sponsors as sponsor}
		<li>{sponsor.name} - {sponsor.amount}</li>
	{/each}
</ul>
