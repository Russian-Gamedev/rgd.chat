import { definePageMetaTags } from 'svelte-meta-tags';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch }) => {
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

	const api = createServerApi({ request, fetch });
	const patrons = await api.getPatrons().catch(() => null);

	return {
		...pageMetaTags,
		patrons
	};
};
