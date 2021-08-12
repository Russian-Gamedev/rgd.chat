<script lang="ts">
	type Article = {
		title: string;
	};

	let articles: Article[] = [{ title: 'Shit' }, { title: 'Some good title' }];
</script>

<svelte:head>
	<title>Статьи</title>
</svelte:head>

{#each articles as article}
	<span>{article.title}</span>
{/each}
