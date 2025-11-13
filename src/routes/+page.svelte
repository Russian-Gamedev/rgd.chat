<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Tertiary from '$lib/components/Tertiary.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Russian Gamedev — Discord сообщество разработчиков игр</title>
</svelte:head>

<Breadcrumb items={[{ label: 'Главная', href: '/' }]} />

<h1>Russian Gamedev — Discord сообщество</h1>

<p class="description">
	Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте
	отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых
	участников и играем в игры.
</p>

<div class="badges">
	<Badge label="Участников" count={data.total} />
	<Badge label="Онлайн" count={data.online} />
</div>

<section class="links">
	<Tertiary label="Полезные ссылки" />
</section>

<style>
	.links {
		margin-top: 48px;
	}

	.badges {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
