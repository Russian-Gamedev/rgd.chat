import { defineBaseMetaTags } from 'svelte-meta-tags';

export const load = ({ url }) => {
	const title = 'Russian Gamedev — Discord сообщество';
	const description =
		'Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых участников и играем в игры.';
	const origin = url.origin === 'http://sveltekit-prerender' ? 'https://rgd.chat' : url.origin;
	const canonical = new URL(url.pathname, origin).href;

	const baseTags = defineBaseMetaTags({
		title,
		titleTemplate: '%s | Russian Gamedev',
		description,
		keywords: ['gamedev', 'game development', 'discord', 'russian gamedev', 'разработка игр'],
		canonical,
		openGraph: {
			type: 'website',
			url: canonical,
			locale: 'ru_RU',
			title,
			description,
			siteName: 'Russian Gamedev',
			images: [
				{
					url: 'https://assets.rgd.chat/banner.jpg',
					alt: 'Russian Gamedev Banner'
				}
			]
		}
	});

	return {
		...baseTags,
		themeColor: '#5c87e7'
	};
};
