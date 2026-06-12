import { definePageMetaTags } from 'svelte-meta-tags';

import { createApi } from '$lib/api/api';

import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ depends, fetch }) => {
	depends('patrons:list');

	const title = 'Донатеры сообщества';
	const description = 'Участники, которые поддерживают Russian Gamedev и помогают сообществу жить.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createApi({ fetch });
	const patrons = await api.getPatrons().catch(() => null);

	return {
		...pageMetaTags,
		patrons
	};
};
