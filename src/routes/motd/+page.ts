import { definePageMetaTags } from 'svelte-meta-tags';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async () => {
	const title = 'MOTD';
	const description = 'Сообщения дня';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	return {
		...pageMetaTags
	};
};
