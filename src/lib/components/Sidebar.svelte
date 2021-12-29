<script lang="ts">
	import { page, session } from "$app/stores";
	import RGD from "$lib/icons/RGD.svelte";
	import Jam from "$lib/icons/Jam.svelte";
	import Joystick from "$lib/icons/Joystick.svelte";
	import Newspaper from "$lib/icons/Newspaper.svelte";
	import Crown from "$lib/icons/Crown.svelte";

	const items: [any, string, string][] = [
		// [Joystick, "Игры", "/games"],
		[Jam, "Джемы", "/jams"],
		// [Newspaper, "Блоги", "/blogs"],
		[Crown, "Донатеры", "/patrons"],
	];
</script>

<aside
	class="sticky flex-shrink-0 w-69 h-screen top-0 pl-12 pb-12 pt-16 flex flex-col bg-black"
>
	<div class="mb-16">
		<a sveltekit:prefetch class="text-white" href="/">
			<RGD />
		</a>
	</div>

	<nav role="menu" class="mb-auto flex flex-col gap-6 text-body">
		{#each items as [icon, title, path]}
			<a
				sveltekit:prefetch
				role="menuitem"
				class="flex gap-4 items-center text-navigation hover:text-white {$page.path ===
				path
					? 'text-white'
					: 'text-body'}"
				href={path}
			>
				<svelte:component this={icon} /> {title}</a
			>
		{/each}
	</nav>

	<!-- <a class="mt-auto flex items-center gap-3" href="/me">
        <img
            class="w-10 h-10 rounded-xl"
            alt="Аватар профиля"
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/Artemy_Lebedev_2020.png"
        />
        <span class="text-navigation text-general">Terisback</span>
    </a> -->
</aside>
