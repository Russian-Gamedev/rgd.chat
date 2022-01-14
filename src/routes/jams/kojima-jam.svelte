<script context="module">
	export const prerender = true;
</script>

<script>
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import Entry from "$lib/components/Jam/Entry.svelte";
	import Header from "$lib/components/Jam/Header.svelte";
	import TertiaryHeader from "$lib/components/TertiaryHeader.svelte";
	import jam from "./kojima-jam";
	import { breadcrumbs } from "./_jams";
</script>

<Breadcrumbs
	path={[...breadcrumbs, { title: jam.title, href: `/jams/${jam.slug}` }]}
/>

<Header {jam} />

<h3 id="description">Описание</h3>

<p>
	Админы копили с обедов, воровали, попрошайничали на конфе.джиди (зэ фэйерли
	комьюнити оф гейм девелопмент) и всё-таки накопили на джем!
</p>

<p>
	Джем — мероприятие в сообществе разработчиков видеоигр. За указанный
	промежуток времени с нуля создаётся игра на заданную в начале джема тему. В
	нашем случае проекты будут также оцениваться жюри по номинациям.
</p>

<h3 id="nominations">Номинации</h3>

<ul>
	<li>Юмор</li>
	<li>Сочный Гений</li>
	<li>Непризнанный Гений</li>
	<li>Филологений</li>
	<li>Гениальный Лентяй</li>
	<li>Злобное отражение гения</li>
	<li>Многозадачный Гений</li>
	<li>Гений Визуализации</li>
</ul>

<h3 id="community-nominations">Комьюнити номинации</h3>

<ul>
	<li>Удачливый Гений</li>
	<li>Гений от Народа</li>
</ul>

<p>
	За победу в каждой номинации денежный приз в размере <span
		class="text-gold font-bold">1000</span
	>
	рублей.
</p>

<h3 id="theme">Тема</h3>

<p>
	Джем проводился прямо перед релизом <a
		rel="external"
		href="https://ru.wikipedia.org/wiki/Death_Stranding">Death Stranding</a
	>
	от непревзайдённого гения Хидео Кодзимы. В честь его и тема джема
	<b>HIDEOKOJIMA-GAME</b>
</p>

{#if jam.games}
	<TertiaryHeader id="games">Игры ({jam.games.length})</TertiaryHeader>

	<div class="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-12 gap-y-8">
		{#each jam.games as game}
			<Entry slug={jam.slug} {game} />
		{/each}
	</div>
{/if}

<style lang="postcss">
	li {
		@apply list-disc list-inside;
	}

	li::marker {
		@apply text-primary;
	}
</style>
