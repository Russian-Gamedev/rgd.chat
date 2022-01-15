<script lang="ts">
	import { userAvatar, badgeColor } from "$lib/tools";
	import type { Badge, JamEntry } from "src/global";
	export let slug: string;
	export let game: JamEntry;
</script>

<div class="relative p-4 grow-0 flex flex-col gap-4 rounded-lg bg-black">
	{#if game.badge}
		<div
			class="absolute m-4 top-3 right-2 py-0.5 px-2 text-badge text-general rounded-full {badgeColor(
				game.badge
			)}"
			title={game.badge.tooltip}
		>
			{game.badge.title.toUpperCase()}
		</div>
	{/if}
	{#if game.image}
		<img
			class="aspect-video object-cover rounded"
			alt=""
			loading="lazy"
			src={`/images/jams/${slug}/${game.image}`}
		/>
	{:else}
		<div
			class="aspect-video flex items-center justify-center rounded bg-control"
		>
			<span class="italic text-card">картинка в другом замке :(</span>
		</div>
	{/if}
	<div class="flex flex-col text-card">
		<span class="flex gap-2 items-center font-bold text-general"
			><img
				class="w-7 h-7 rounded-full"
				alt=""
				aria-label={`Аватар ${game.author.username}`}
				loading="lazy"
				src={userAvatar(game.author)}
			/>{game.author.username}</span
		>
		<span class="mt-1.5 max-w-[17rem]">{game.name}</span>
	</div>
</div>
