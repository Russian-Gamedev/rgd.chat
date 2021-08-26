<script lang="ts">
	type Post = {
		title: string;
	};

	let posts: Post[] = [{ title: 'Title one' }, { title: 'Title two' }];
</script>

<svelte:head>
	<title>Блоги</title>
</svelte:head>

{#each posts as post}
	<span>{post.title}</span>
{/each}
