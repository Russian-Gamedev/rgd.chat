import { defineBaseMetaTags } from 'svelte-meta-tags';

export const load = ({ url }) => {
	const title = 'Russian Gamedev — Discord сообщество';
	const description =
		'Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых участников и играем в игры.';

	const baseTags = defineBaseMetaTags({
		title,
		titleTemplate: '%s | Russian Gamedev',
		description,
		keywords: ['gamedev', 'game development', 'discord', 'russian gamedev', 'разработка игр'],
		canonical: new URL(url.pathname, url.origin).href,
		openGraph: {
			type: 'website',
			url: new URL(url.pathname, url.origin).href,
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
