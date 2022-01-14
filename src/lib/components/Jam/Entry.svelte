<script lang="ts">
	import { userAvatar } from "$lib/tools/avatar";

	import type { JamEntry } from "src/global";

	export let slug: string;
	export let game: JamEntry;
</script>

<div class="relative p-4 grow-0 flex flex-col gap-4 rounded-lg bg-black">
	{#if game.image}
		<img
			class="aspect-video object-cover rounded"
			alt=""
			src={`/images/jams/${slug}/${game.image}`}
		/>
	{:else}
		<div
			class="w-[17rem] aspect-video flex items-center justify-center rounded bg-control"
		>
			<span class="italic text-card">картинка в другом замке :(</span>
		</div>
	{/if}
	<div class="flex flex-col text-card">
		<span class="flex gap-2 items-center font-bold text-general"
			><img
				class="w-7 h-7 rounded-full"
				alt="Аватар автора"
				loading="lazy"
				src={userAvatar(game.author)}
			/>{game.author.username}</span
		>
		<span class="mt-1.5 max-w-[17rem]">{game.name}</span>
	</div>
</div>
