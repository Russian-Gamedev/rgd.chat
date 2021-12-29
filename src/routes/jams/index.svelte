<script>
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import ChevronRight from "$lib/icons/ChevronRight.svelte";
</script>

<a
	class="relative p-4 w-full aspect-[21/9] flex flex-col gap-4 justify-end bg-gradient-to-t from-[#0008] via-[#0000] rounded-lg"
	sveltekit:prefetch
	href="/jams/kojima-jam"
>
	<img
		class="absolute top-0 left-0 w-full h-full object-cover -z-10 rounded-lg"
		alt={`Обложка kojima-jam`}
		src={`/images/banner.jpg`}
	/>
	<div class="flex justify-between items-center">
		<div class="text-card">
			<div class="text-general font-bold">
				KOJIMA-ДЖЕМ на Russian Gamedev (Discord сообщество)
			</div>
			<div class="mt-1.5">
				Админы копили с обедов, воровали, попрошайничали на конфэ джиди...
			</div>
		</div>
	</div>
</a>

<TertiaryHeader>Джемы</TertiaryHeader>
