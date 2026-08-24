import { definePageMetaTags } from 'svelte-meta-tags';

import { redirect } from '@sveltejs/kit';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, request, fetch, depends }) => {
	depends('events:list');

	const { auth } = await parent();
	if (!auth) {
		throw redirect(302, import.meta.env.VITE_AUTH_URL || '/');
	}

	const title = 'События';
	const description =
		'Шаблоны сообщений о событиях на сервере: вступления, выходы, баны и кики. Можно добавить свои через кнопку ниже или в дискорд боте через /event add.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createServerApi({ request, fetch });
	const eventsList = await api.getEventsList().catch(() => null);

	return {
		...pageMetaTags,
		eventsList
	};
};
