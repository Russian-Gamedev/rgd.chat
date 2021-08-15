<script lang="ts">
	import sponsors from '$lib/sponsors';
</script>

<svelte:head>
	<title>Спонсоры сервера</title>
</svelte:head>

<div class="sponsors">
	<h1>Поддержавшие Russian Gamedev</h1>

	<div>
		Основной способ поддержать RGD это
		<a rel="external" href="https://donatty.com/rgd">Donatty</a>
	</div>
	<div id="sponsors">Спасибо всем кто <b>&nbsp;уже&nbsp;</b> поддержал</div>

	<table>
		{#each sponsors as sponsor}
			<tr>
				<td class="name">{sponsor.name}</td>
				<td class="amount"
					>{sponsor.amount.toLocaleString('ru-RU', {
						style: 'currency',
						currency: 'RUB',
						maximumFractionDigits: 0,
						minimumFractionDigits: 0
					})}</td
				>
			</tr>
		{/each}
	</table>
</div>

<style>
	.sponsors {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		align-items: center;
	}

	table {
		overflow: auto;
		width: max-content;
		max-width: 100%;
		font-variant-numeric: lining-nums tabular-nums;
	}

	tr {
		background-color: var(--secondary-color);
	}

	tr:nth-child(2n) {
		background-color: var(--tertiary-color);
	}

	td {
		padding: 0.5rem;
	}

	.name {
		padding-right: 1rem;
		min-width: 12rem;
	}

	.amount {
		text-align: right;
	}

	#sponsors {
		display: inline-flex;
	}

	#sponsors::after {
		/* position: absolute; */
		margin-left: 0.4rem;
		display: inline-block;
		content: url('/icons/sponsors.svg');
		min-width: 1.5em;
	}
</style>
