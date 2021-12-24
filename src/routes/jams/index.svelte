<script>
	import ChevronRight from "$lib/icons/ChevronRight.svelte";
</script>

<div class="w-fit flex flex-col gap-4 p-4 rounded-lg bg-black">
	<img
		class="w-[61rem] aspect-[3/1] object-cover rounded-[.25rem] bg-control"
		alt="Поддержи RGD"
		src="/images/banner.jpg"
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
		<a
			class="py-3 pl-5 pr-4 flex gap-3 items-center font-bold text-white text-base bg-primary rounded-lg"
			rel="external"
			href="https://donatty.com/rgd"
			>Подробнее <ChevronRight />
		</a>
	</div>
</div>
