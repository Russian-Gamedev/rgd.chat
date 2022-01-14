<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import type { Jam } from "src/global";
	import { breadcrumbs, jams } from "./_jams";

	let jam: Jam = jams[0];
</script>

<Breadcrumbs path={breadcrumbs} />

<a
	class="relative p-4 w-full aspect-[21/9] flex flex-col gap-4 justify-end rounded-lg bg-control"
	sveltekit:prefetch
	href={`/jams/${jam.slug}`}
>
	<img
		class="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
		alt={`Обложка ${jam.slug}`}
		src={jam.thumbnail || `/images/banner.jpg`}
	/>
	<div
		class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#0008] via-[#0000] rounded-lg"
	/>
	<div class="z-10 flex justify-between items-center">
		<div class="text-card">
			<div class="text-general font-bold">
				{jam.display_title || jam.title}
			</div>
			<div class="mt-1.5">
				{jam.display_desc}
			</div>
		</div>
	</div>
</a>

<TertiaryHeader>Джемы</TertiaryHeader>

{#each jams.slice(1) as jam}
	<a href={`/jams/${jam.slug}`}>{jam.title}</a>
{:else}
	<p>И было их пятеро...</p>
{/each}
