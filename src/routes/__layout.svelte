<script>
	import Sidebar from "$lib/components/Sidebar.svelte";
	import "../app.css";
</script>

<Sidebar />

<main class="mt-16 mb-16 mr-10 w-full max-w-[63rem] text-base">
	<slot />
</main>
