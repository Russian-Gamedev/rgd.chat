<script lang="ts">
	import type { Jam } from "src/global";

	export let jam: Jam;
</script>

<div class="flex xl:flex-row flex-col gap-7">
	{#if jam.stream}
		<iframe
			class="h-[21rem] aspect-video rounded-lg bg-control"
			src={jam.stream}
			title="Запись джема"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
	{:else}
		<div
			class="h-[21rem] aspect-video rounded-lg bg-control flex items-center justify-center"
		>
			<span class="text-navigation"
				>А где стрим? Может его никогда и не было...</span
			>
		</div>
	{/if}
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
			<h3 class="m-0">Даты проведения</h3>
			<p class="m-0 mt-1">
				{new Date(jam.start * 1000).toLocaleDateString("ru-RU")}
				–
				{new Date(jam.end * 1000).toLocaleDateString("ru-RU")}
			</p>
		</div>
	</div>
</div>
