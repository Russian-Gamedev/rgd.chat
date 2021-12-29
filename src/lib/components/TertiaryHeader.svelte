<script>
	export let id = "";
</script>

<h3 {id} class="mt-12 mb-6 pl-4 font-bold text-lg text-white">
	<slot />
</h3>

<style lang="postcss">
	h3::before {
		content: "";
		@apply absolute ml-[-0.95rem] w-1 h-7 rounded-xl bg-primary;
	}
</style>
