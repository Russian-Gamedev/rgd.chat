<script lang="ts">
	import ExternalLink from '$lib/assets/icons/external-link.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Button from '$lib/components/Button.svelte';
	import Tertiary from '$lib/components/Tertiary.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

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

<Button as="a" class="join-button" href="https://join.rgd.chat" target="_blank">
	Присоединиться
	<ExternalLink />
</Button>

<section class="links">
	<Tertiary label="Полезные ссылки" />
</section>

<style>
	:global(.join-button) {
		font-weight: bold;
		font-size: 20px;
		margin: 24px 0;
	}

	.links {
		margin-top: 48px;
	}

	.badges {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
