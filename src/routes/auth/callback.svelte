<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		return {
			status: 200,
			error: new Error(`Could not load`)
		};
	}
</script>
