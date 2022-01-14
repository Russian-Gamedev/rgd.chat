<script lang="ts">
	import ChevronRight from "$lib/icons/ChevronRight.svelte";
	import type { BreadcrumbPart } from "src/global";

	export let path: BreadcrumbPart[];
</script>

<div class="mb-10 text-navigation text-general flex gap-2">
	{#each path as part, index}
		<div
			class="flex gap-2 items-center"
			class:text-body={index < path.length - 1}
		>
			<a href={part.href}>{part.title}</a>
			{#if index < path.length - 1}
				<ChevronRight width={12} height={12} />
			{/if}
		</div>
	{/each}
</div>
