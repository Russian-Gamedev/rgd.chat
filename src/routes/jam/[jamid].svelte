<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		return {
			props: {
				jamid: page.params.jamid
			}
		};
	}
</script>

<script lang="ts">
	export let jamid;
</script>

<h1>{jamid}</h1>
<p>Placeholder</p>
