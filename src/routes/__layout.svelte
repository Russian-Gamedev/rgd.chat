<script>
	import Sidebar from "$lib/components/Sidebar.svelte";
	import "../app.css";
</script>

<Sidebar />

<div class="mt-16 mb-16 mr-10 w-full max-w-5xl text-base">
	<slot />
</div>
