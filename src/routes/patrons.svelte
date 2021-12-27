<script lang="ts">
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import type { Patron } from "src/global";
	import DollarSign from "$lib/icons/DollarSign.svelte";

	const patrons: Patron[] = [
		{
			id: "408367130988511234",
			username: "Benedique",
			avatar_url:
				"https://cdn.discordapp.com/avatars/408367130988511234/d051bc8f0b62a17615c90b26d5f03db7.png?size=64",
			banner_url:
				"https://cdn.discordapp.com/banners/408367130988511234/bc28bcba72c4f4bd4f8519c13d253d3e.png?size=512",
			amount: 16150,
		},
		{
			id: "357599627605966848",
			username: "Дядя Женя",
			avatar_url:
				"https://cdn.discordapp.com/avatars/357599627605966848/7a73bf25d03dd355bcf6b26d371b3f71.png?size=64",
			banner_color: "#DFB569",
			amount: 12600,
		},
		{
			id: "183367789501874176",
			username: "YellowAfterlife",
			avatar_url:
				"https://cdn.discordapp.com/avatars/183367789501874176/3d3a6113f1c3199a3937f98b6ec4aeb1.png?size=64",
			banner_url:
				"https://img.itch.zone/aW1nLzQzODQyOTEucG5n/original/RcHvAV.png",
			amount: 10000,
		},
		{
			id: "684894972071116802",
			username: "Хатсимуфа",
			avatar_url:
				"https://cdn.discordapp.com/avatars/684894972071116802/1578c251ba053a32a90fecf541cedbb1.png?size=64",
			amount: 8200,
		},
		{
			id: "275810273825128449",
			username: "Коля",
			avatar_url:
				"https://cdn.discordapp.com/avatars/275810273825128449/23b841b15d703b7b8a86790b4fa67856.png?size=64",
			amount: 6000,
		},
		{
			id: "284760261242519554",
			username: "Atria Games",
			avatar_url:
				"https://cdn.discordapp.com/avatars/284760261242519554/47be49f268e7c69d80ec6a1ba7062937.png?size=64",
			amount: 5000,
		},
		{
			id: "179893756563161088",
			username: "tigr",
			avatar_url:
				"https://cdn.discordapp.com/avatars/179893756563161088/4dde4bff32e757ea2b9ff2a7b432c28e.png?size=64",
			amount: 4500,
		},
		{
			id: "159839961850445824",
			username: "glebster51",
			avatar_url:
				"https://cdn.discordapp.com/avatars/159839961850445824/decf2640ab53556dc5e9f3cacc199d4b.png?size=64",
			amount: 4186,
		},
		{
			id: "153078622536597504",
			username: "Edisoni",
			avatar_url:
				"https://cdn.discordapp.com/avatars/153078622536597504/f67c1184c843b2d6290e48efe09e2dd2.png?size=64",
			amount: 3000,
		},
		{
			id: "195537384429977600",
			username: "Scraw",
			avatar_url:
				"https://cdn.discordapp.com/avatars/195537384429977600/75d156a811d62e677621f2211ac12049.png?size=64",
			amount: 3000,
		},
		{
			id: "276082822861684737",
			username: "Midnight",
			avatar_url:
				"https://cdn.discordapp.com/avatars/276082822861684737/a_57bf2b810207d915f7174ad8fd229def.gif?size=64",
			amount: 2500,
		},
		{
			id: "281037696225247233",
			username: "Terisback",
			avatar_url:
				"https://cdn.discordapp.com/avatars/281037696225247233/a_7fc45e72e599ddf519ffba81538dd380.gif?size=64",
			amount: 1638,
		},
		{
			id: "237877108486045707",
			username: "TushkaN",
			avatar_url:
				"https://cdn.discordapp.com/avatars/237877108486045707/a_2d7b0f06919a04ebc25d053b09c07bee.gif?size=64",
			amount: 1500,
		},
		{
			id: "228914165144616960",
			username: "Scorpicore",
			avatar_url:
				"https://cdn.discordapp.com/avatars/228914165144616960/82afedc64450ea21037cad505ad8d770.png?size=64",
			amount: 1400,
		},
		{
			id: "196659698097717248",
			username: "Vovun",
			avatar_url:
				"https://cdn.discordapp.com/avatars/196659698097717248/a52f4d4e176e02396bff745e067da472.png?size=64",
			amount: 1000,
		},
		{
			id: "209387687948320769",
			username: "Jesus_3k",
			avatar_url:
				"https://cdn.discordapp.com/avatars/209387687948320769/7d42bafcf712dbc32a7d698924ae1d7b.png?size=64",
			amount: 650,
		},
		{
			id: "471759061730459658",
			username: "lusenpai",
			avatar_url:
				"https://cdn.discordapp.com/avatars/471759061730459658/69c1562ceae240326eee0423d15f6258.png?size=64",
			amount: 500,
		},
		{
			id: "443854622419845131",
			username: "No More Goose",
			avatar_url:
				"https://cdn.discordapp.com/avatars/443854622419845131/20fd3293144ed1e60e2979d47b50e371.png?size=64",
			amount: 440,
		},
		{
			id: "169051332311908353",
			username: "VISHNYA",
			avatar_url:
				"https://cdn.discordapp.com/avatars/169051332311908353/70768384f2f9ccb37fc09f037e261716.png?size=64",
			amount: 350,
		},
		{
			id: "435255049841672193",
			username: "Lordus",
			avatar_url:
				"https://cdn.discordapp.com/avatars/435255049841672193/a05cbf6e27604c4ae78111fc0f847272.png?size=64",
			amount: 250,
		},
		{
			id: "371690693233737740",
			username: "Fataliti // Reifshneider",
			avatar_url:
				"https://cdn.discordapp.com/avatars/371690693233737740/a_114c9cfc64e3080ca0d5fc4d0d36b1fe.gif?size=64",
			amount: 210,
		},
		{
			username: "Гусь лох",
			amount: 200,
		},
		{
			id: "723551879480737922",
			username: "TodNaz",
			avatar_url:
				"https://cdn.discordapp.com/avatars/723551879480737922/54faf5e543a44817dd486a8ec7ae4759.png?size=64",
			amount: 180,
		},
		{
			username: "Выго",
			amount: 150,
		},
		{
			username: "Farious",
			amount: 100,
		},
		{
			username: "enot",
			amount: 73,
		},
		{
			id: "352903663598960643",
			username: "maksimf198",
			avatar_url:
				"https://cdn.discordapp.com/avatars/352903663598960643/15f9a8fcac703685dc4581489ca752e7.png?size=64",
			amount: 10,
		},
	];

	function patronAvatar(patron: Patron, size: number = 64): string {
		if (patron.avatar_url) {
			let avatar = new URL(patron.avatar_url);
			avatar.searchParams.set("size", size.toString());
			return avatar.toString();
		} else if (patron.id) {
			// It's definitely not right, but I dont give a fuck
			return `https://cdn.discordapp.com/embed/avatars/${
				+patron.id % 5
			}.png?size=${+size}`;
		} else {
			return `https://cdn.discordapp.com/embed/avatars/${
				patron.username.charCodeAt(0) % 5
			}.png?size=${+size}`;
		}
	}

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

<a
	class="w-fit flex flex-col gap-4 p-4 rounded-lg bg-black"
	rel="external"
	href="https://donatty.com/rgd"
>
	<img
		class="w-[61rem] aspect-[3/1] object-cover rounded-[.25rem] bg-control"
		alt="Поддержи RGD"
		src="/images/sponsors.jpg"
	/>
	<div class="flex justify-between items-center">
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

<TertiaryHeader>Доска почёта</TertiaryHeader>

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
					src={patronAvatar(patron, 32)}
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
