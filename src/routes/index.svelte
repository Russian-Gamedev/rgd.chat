<script context="module" lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import { page } from '$app/stores';

	export const prerender = true;
</script>

<MetaTags
	title="Russian Gamedev — Discord сообщество"
	openGraph={{
		site_name: 'Russian Gamedev',
		title: 'Главная',
		description:
			'Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых участников и играем в игры.',
		type: 'website',
		locale: 'ru_RU',
		url: 'https://' + $page.host,
		images: [
			{
				url: 'https://' + $page.host + '/placeholders/banner.jpg'
			}
		]
	}}
/>

<section id="server-info">
	<div class="info">
		<div class="text">
			<h1>Russian Gamedev — Discord сообщество</h1>
			<p>
				Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей,
				найдёте отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно
				срём новых участников и играем в игры.
			</p>
		</div>
		<div class="stats">
			<Badge>УЧАСТНИКОВ: <span class="label__counter">2 347</span></Badge>
			<Badge>ОНЛАЙН: <span class="label__counter">758</span></Badge>
		</div>
	</div>
	<a class="invite" rel="external" href="https://discord.gg/EKUg5VhCVW">Присоединиться</a>
</section>

<section id="useful-links">
	<h3>Полезные ссылки</h3>
	<div class="useful-links">
		<a class="useful-link" rel="external" href="https://vk.com/rgd_discord">
			<div class="useful-link__icon">
				<img src="/icons/social_vk.svg" alt="ВК" />
			</div>
			<div class="useful-link__text">
				<h5>Вконтакте</h5>
				<p>Сообщество ВК</p>
			</div>
		</a>
		<a
			class="useful-link"
			rel="external"
			href="https://www.youtube.com/channel/UCZq4wK7UprpSiJRQLIjtbqw"
		>
			<div class="useful-link__icon">
				<img src="/icons/social_yt.svg" alt="YT" />
			</div>
			<div class="useful-link__text">
				<h5>YouTube</h5>
				<p>Записи итогов джемов</p>
			</div>
		</a>
		<a sveltekit:prefetch class="useful-link" href="/jam/wizard-jam">
			<div class="useful-link__icon">
				<img src="/icons/social_jam.svg" alt="Jam" />
			</div>
			<div class="useful-link__text">
				<h5>Последний джем</h5>
				<p>35 игр, 5 часов прохождения</p>
			</div>
		</a>
	</div>
</section>

<style>
	section#server-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		flex: 1; /* uncomment for not centered content*/
		gap: 1.2rem;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 1.3rem;
	}

	.text p {
		margin: 0;
		color: var(--dimmed);
	}

	.stats {
		display: flex;
		gap: 1rem;
	}

	.label__counter {
		color: var(--primary);
	}

	.invite {
		display: block;
		padding: 0.6rem 1rem;
		border-radius: 0.4rem;
		font-weight: 500;
		line-height: 1.2rem;
		color: var(--pure-white);
		background-color: var(--primary);
	}

	.invite:hover {
		text-decoration: none;
	}

	section#useful-links {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.useful-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		column-gap: 2.4rem;
		row-gap: 1.6rem;
	}

	.useful-link {
		flex: 1 1 13rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 0.8rem;
		border-radius: 0.4rem;
		background-color: var(--secondary-background);
	}

	.useful-link:hover {
		text-decoration: none;
	}

	.useful-link__icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		height: 2rem;
		/* padding: 0.5rem; */
		border-radius: 0.6rem;
		background-color: var(--primary);
		overflow: hidden;
	}

	.useful-link__icon img {
		width: 1rem;
	}

	.useful-link__text {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.useful-link__text h5 {
		margin: 0;
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--pure-white);
	}

	.useful-link__text p {
		margin: 0;
		font-size: 0.7rem;
		font-weight: 400;
		color: var(--dimmed);
	}
</style>
