<script context="module">
	export const prerender = true;
	export async function load({ fetch, page: { params } }) {
		const { slug } = params;
		const res = await fetch(`/jams/${slug}.json`);
		if (res.ok) {
			const { jam } = await res.json();
			return {
				props: { jam },
			};
		}

		return {
			status: 404,
			error: `Unable to fetch '${slug}' jam`,
		};
	}
</script>

<script>
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import { userAvatar } from "$lib/utils/avatar";

	export let jam;
</script>

<div class="flex xl:flex-row flex-col gap-7">
	<iframe
		class="h-[21rem] aspect-video rounded-lg bg-control"
		src={jam.stream}
		title="Запись джема"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/>
	<div class="flex flex-col gap-6">
		<div>
			<span class="font-bold text-lg text-primary">
				{jam.season}
			</span>
			<h2 class="m-0 mt-3 mb-2">
				{jam.title}
			</h2>
		</div>
		<div>
			<h3 class="m-0">Призовой фонд</h3>
			<p class="m-0 mt-1">
				{#each jam.prize.split("\n") as line}
					{line} <br />
				{/each}
			</p>
		</div>
		<div>
			<h3 class="m-0">Дата проведения</h3>
			<p class="m-0 mt-1">
				{jam.start}
				{jam.end}
			</p>
		</div>
	</div>
</div>

{@html jam.html}

{#if jam.games}
	<TertiaryHeader id="games">Игры ({jam.games.length})</TertiaryHeader>

	<div class="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-12 gap-y-8">
		{#each jam.games as game}
			<div class="relative p-4 grow-0 flex flex-col gap-4 rounded-lg bg-black">
				{#if game.image}
					<img
						class="aspect-video object-cover rounded"
						alt=""
						src={`/src/jams/${jam.slug}/${game.image}`}
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
							src={userAvatar(game.author)}
						/>{game.author.username}</span
					>
					<span class="mt-1.5 max-w-[17rem]">{game.name}</span>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	:global(li) {
		@apply list-disc list-inside;
	}

	:global(li::marker) {
		@apply text-primary;
	}
</style>
