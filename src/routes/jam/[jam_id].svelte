<script context="module" lang="ts">
	import { supabase } from '$lib/db';

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, session, context }) {
		let { data: jams, error } = await supabase
			.from('jams')
			.select('*')
			.eq('slug', page.params.jam_id);

		if (jams[0]) {
			return {
				props: {
					jam: jams[0]
				}
			};
		}

		return {
			status: 404,
			error: error
		};
	}
</script>

<script lang="ts">
	import ContentBlock from '$lib/components/ContentBlock.svelte';
	import type { Jam } from '$lib/types';
	export let jam: Jam;
</script>

<div class="jam-header">
	<div class="jam-shit">
		{@html jam.stream_embed}
		<div class="jam-info">
			<div class="info-header">
				<h3 class="jam-category">Архив 2020</h3>
				<h2>{jam.title}</h2>
			</div>

			<div class="info-non-important">
				{#if jam.theme}
					<div class="non-important-block">
						<h3>Тема</h3>
						<p>{jam.theme}</p>
					</div>
				{/if}

				{#if jam.prize_fund}
					<div class="non-important-block">
						<h3>Призовой фонд</h3>
						<p>{jam.prize_fund}</p>
					</div>
				{/if}

				{#if jam.start_date}
					<div class="non-important-block">
						<h3>Дата проведения</h3>
						<p>{jam.start_date}<br />{jam.end_date}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="jam-header-content">
		{#each jam.content.blocks as block}
			<ContentBlock {block} />
		{/each}
	</div>
</div>

<style lang="scss">
	.jam-header {
		display: flex;
		flex-direction: column;
		gap: 1.4rem;

		.jam-shit {
			display: flex;
			gap: 1.4rem;
		}

		.jam-info,
		.info-header,
		.info-non-important,
		.non-important-block {
			display: flex;
			flex-direction: column;
		}

		.jam-info {
			gap: 1.6rem;
		}

		.info-header {
			gap: 0.6rem;
		}

		.info-non-important {
			gap: 1.2rem;
		}

		.non-important-block {
			gap: 0.2rem;
		}

		h3 {
			padding-left: unset;

			&::before {
				display: none;
			}
		}

		.jam-category {
			color: var(--primary);
		}

		&-content {
			display: flex;
			flex-direction: column;
			gap: 0.4rem;
		}
	}

	:global(main p) {
		color: var(--dimmed-text);
	}
</style>
