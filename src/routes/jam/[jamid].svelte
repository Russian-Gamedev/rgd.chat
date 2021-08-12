<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => {
		// const res = await fetch('/todos.json');

		// if (res.ok) {
		// 	const todos = await res.json();

		// 	return {
		// 		props: { todos }
		// 	};
		// }

		// const { message } = await res.json();

		// return {
		// 	error: new Error(message)
		// };
		return {
			props: {
				jam: {
					title: page.params.jamid
				}
			}
		};
	};
</script>

<script lang="ts">
	import type { Jam } from '$lib/types';
	export let jam: Jam;
</script>

<h1>Jam</h1>

<span>
	{jam.title}
</span>
