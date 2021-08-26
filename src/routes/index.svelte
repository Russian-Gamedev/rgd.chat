<script context="module" lang="ts">
	export const prerender = true;
</script>

<svelte:head>
	<title>RGD</title>
</svelte:head>

<section>
	<h1>Russian Gamedev — русскоязычное Gamedev сообщество</h1>
	<p>
		Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте
		отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых
		участников и играем в игры.
	</p>
	<pre>Участников: 2347, Онлайн: 758</pre>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		flex: 1; /* uncomment for not centered content*/
	}

	p {
		color: var(--dimmed);
	}
</style>
