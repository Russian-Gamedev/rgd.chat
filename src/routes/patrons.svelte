<script lang="ts">
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import { patrons } from "./_patrons";
	import { userAvatar } from "$lib/tools";
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";

	function patronBadge(index: number): string {
		switch (index + 1) {
			case 1:
				return "bg-gold";
			case 2:
				return "bg-silver";
			case 3:
				return "bg-bronze";
			default:
				return "bg-primary";
		}
	}

	function patronBannerAllowed(index: number): boolean {
		return index < 3;
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://cdn.discordapp.com" />
</svelte:head>

<Breadcrumbs
	path={[
		{ title: "Главная", href: "/" },
		{ title: "Патроны", href: "/patrons" },
	]}
/>

<a
	class="relative p-4 w-full aspect-[21/9] flex flex-col gap-4 justify-end rounded-lg bg-control"
	rel="external"
	href="https://donatty.com/rgd"
>
	<img
		class="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
		alt="Поддержи RGD"
		src="/images/sponsors.jpg"
	/>
	<div
		class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#0008] via-[#0000] rounded-lg"
	/>
	<div class="z-10 flex justify-between items-center">
		<div class="text-card">
			<div class="text-general font-bold">Возможность внести свою лепту</div>
			<div class="mt-1.5">
				Основной способ поддержать Russian Gamedev — <a
					class="text-link hover:text-link-visited"
					rel="external"
					href="https://donatty.com/rgd">Donatty</a
				>
			</div>
		</div>
	</div>
</a>

<TertiaryHeader id="cool-guys">Доска почёта</TertiaryHeader>

<div class="flex flex-wrap gap-12 gap-y-8">
	{#each patrons as patron, index}
		<div class="w-[19rem] flex flex-col bg-black rounded-lg">
			{#if patron.banner_url && patronBannerAllowed(index)}
				<img
					alt={`Баннер ${patron.username}`}
					class="aspect-[152/65] object-cover rounded-t-lg"
					src={patron.banner_url}
				/>
			{:else if patron.banner_color && patronBannerAllowed(index)}
				<div
					class="aspect-[152/65] object-cover rounded-t-lg"
					style="background: {patron.banner_color}"
				/>
			{:else}
				<!-- Заплатка если юзер будет в одном ряду с разрешённым баннером -->
				<div class="h-full object-cover rounded-t-lg bg-control" />
			{/if}
			<div class="p-4 flex gap-2 items-center font-bold text-card text-general">
				<img
					class="w-7 h-7 rounded-full"
					alt={`${patron.username} avatar`}
					src={userAvatar(patron, 32)}
				/>{patron.username}
				<div
					class="ml-auto py-0.5 px-2 text-badge rounded-full {patronBadge(
						index
					)}"
				>
					{patron.amount.toLocaleString("ru-RU", {
						style: "currency",
						currency: "RUB",
						maximumFractionDigits: 0,
						minimumFractionDigits: 0,
					})}
				</div>
			</div>
		</div>
	{/each}
</div>
