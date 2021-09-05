<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		return {
			props: {
				jamId: page.params.jam_id
			}
		};
	}
</script>

<script lang="ts">
	import { jams } from '$lib/jams';
	import type { Jam } from '$lib/types';
	export let jamId;

	const jam: Jam = jams.find((element) => {
		if (element.id == jamId) {
			return true;
		}
		return false;
	});
</script>

<h1>{jamId}</h1>
<pre>{JSON.stringify(jam, null, '  ')}</pre>
{@html jam.streamEmbed}
