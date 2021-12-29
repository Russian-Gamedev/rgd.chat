<script context="module">
	export const ssr = false;
	const jams = import.meta.globEager("../../jams/**/*.md");

	let body = [];
	for (let path in jams) {
		const post = jams[path];
		const metadata = post.metadata;
		const pathArray = path.split("/");
		const slug = pathArray[pathArray.length - 2];
		const p = { post, path, slug, metadata };
		body.push(p);
	}

	export const load = ({ page }) => {
		const posts = body;
		const { slug } = page.params;
		const filteredPosts = posts.filter((p) => {
			return p.slug.toLowerCase() === slug.toLowerCase();
		});

		const filtered = filteredPosts[0];

		filtered.metadata.games.sort((a, b) => {
			const ao = !!a.order;
			const bo = !!b.order;

			if (!ao && !bo) {
				return 0;
			}

			if (ao && !bo) {
				return -1;
			}

			if (!ao && bo) {
				return 1;
			}

			if (ao && bo) {
				return a.order - b.order;
			}
		});

		return {
			props: {
				page: filtered.post.default,
				metadata: filtered.metadata,
			},
		};
	};
</script>

<script>
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";

	export let page;
	export let metadata;
</script>

<svelte:component this={page} />

<TertiaryHeader>Игры ({metadata.games.length})</TertiaryHeader>

{#each metadata.games as game}
	<h3>{game.name} {game.order}</h3>
{/each}
