import { definePageMetaTags } from 'svelte-meta-tags';

export const load = async () => {
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
