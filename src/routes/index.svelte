<script context="module" lang="ts">
	export const prerender = true;
</script>

<svelte:head>
	<title>RGD</title>
</svelte:head>

<section>
	<h1>Russian Gamedev</h1>
	<p>Русскоязычное Gamedev сообщество</p>
	<pre>Делаем игры, игрусики, игрули. Техас рисует штуки, вуки, буки, внуки.</pre>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1; /* uncomment for not centered content*/
	}

	h1 {
		width: 100%;
	}
</style>
