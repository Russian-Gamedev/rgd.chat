import { defineBaseMetaTags } from 'svelte-meta-tags';

import { SITE_DESCRIPTION, SITE_URL } from '$lib/site-config';

export const load = ({ url, data }) => {
	const title = 'Russian Gamedev — Discord сообщество';
	const description = SITE_DESCRIPTION;
	const canonical = new URL(url.pathname, SITE_URL).href;

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
		},
		twitter: {
			cardType: 'summary_large_image',
			image: 'https://assets.rgd.chat/banner.jpg'
		}
	});

	return {
		...data,
		...baseTags,
		themeColor: '#5c87e7'
	};
};
