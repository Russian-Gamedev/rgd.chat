import { definePageMetaTags } from 'svelte-meta-tags';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const title = 'UI Kit';
	const description = 'Компоненты пользовательского интерфейса Russian Gamedev';

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
