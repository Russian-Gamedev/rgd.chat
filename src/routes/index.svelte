<script lang="ts">
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import ColorfulJam from "$lib/icons/ColorfulJam.svelte";
	import SocialVk from "$lib/icons/SocialVK.svelte";
	import SocialYt from "$lib/icons/SocialYT.svelte";
	import ExternalLink from "$lib/icons/ExternalLink.svelte";
	import { stats } from "$lib/stores/stats";
	import Kringga from "$lib/icons/Kringga.svelte";
	import Github from "$lib/icons/Github.svelte";
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
</script>

<div class="h-full flex flex-col">
	<Breadcrumbs path={[{ title: "Главная", href: "/" }]} />

	<h1>Russian Gamedev — Discord сообщество</h1>
	<p>
		Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих
		игр и идей, найдёте отличных напарников которые не бросят под самый релиз, и
		живой войс где мы регулярно срём новых участников и играем в игры.
	</p>
	<div class="flex gap-5 font-semibold text-badge uppercase text-general">
		<div class="py-0.5 px-2 rounded-full bg-black">
			участников: <span class="text-primary"
				>{$stats.members.toLocaleString("ru-RU")}</span
			>
		</div>
		<div class="py-0.5 px-2 rounded-full bg-black">
			онлайн: <span class="text-primary"
				>{$stats.online.toLocaleString("ru-RU")}</span
			>
		</div>
	</div>
	<a
		class="mt-6 py-3 pl-5 pr-4 w-fit flex gap-3 items-center font-bold text-white bg-primary rounded-lg"
		rel="external"
		href="https://discord.gg/EKUg5VhCVW"
	>
		Присоединится
		<ExternalLink />
	</a>
	<TertiaryHeader>Полезные ссылки</TertiaryHeader>
	<div class="mb-12 flex gap-12 gap-y-8 flex-wrap">
		<a
			class="p-4 w-[19rem] flex flex-col items-start rounded-lg bg-black"
			rel="external"
			href="https://www.youtube.com/channel/UCZq4wK7UprpSiJRQLIjtbqw"
		>
			<div
				class="p-2.5 w-10 h-10 flex justify-center items-center text-white bg-primary rounded-xl"
			>
				<SocialYt />
			</div>
			<div class="mt-4">
				<div class="text-card font-bold text-general">YouTube</div>
				<div class="mt-1.5 text-card">Записи подведения итогов джемов</div>
			</div>
		</a>
		<a
			class="p-4 w-[19rem] flex flex-col items-start rounded-lg bg-black"
			rel="external"
			href="https://youtu.be/bDBhfamPtvo"
		>
			<div
				class="p-2.5 w-10 h-10 flex justify-center items-center text-white bg-primary rounded-xl"
			>
				<ColorfulJam />
			</div>
			<div class="mt-4">
				<div class="text-card font-bold text-general">Последний джем</div>
				<div class="mt-1.5 text-card">35 игр, 5 часов прохождения</div>
			</div>
		</a>
		<a
			class="p-4 w-[19rem] flex flex-col items-start rounded-lg bg-black"
			rel="external"
			href="https://vk.com/game_maker"
		>
			<div
				class="p-2.5 w-10 h-10 flex justify-center items-center text-white bg-primary rounded-xl"
			>
				<SocialVk />
			</div>
			<div class="mt-4">
				<div class="text-card font-bold text-general">ВКонтакте</div>
				<div class="mt-1.5 text-card">Сообщество по Game Maker</div>
			</div>
		</a>
	</div>

	<div class="mt-auto flex gap-6 text-general text-badge">
		<a
			class="py-0.5 px-2 flex items-center rounded-full bg-black"
			rel="external"
			href="https://www.behance.net/KRINGGA"
		>
			<Kringga />
		</a>
		<a
			class="py-0.5 px-2 flex items-center rounded-full bg-black"
			rel="external"
			href="https://github.com/Russian-Gamedev/rgd.chat"
		>
			<Github />
		</a>
	</div>
</div>
