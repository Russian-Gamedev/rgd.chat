import { definePageMetaTags } from 'svelte-meta-tags';

import { createApi } from '$lib/api/api';

import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ depends, fetch, url }) => {
	depends('games:public-list');
	const tag = url.searchParams.get('tag') || undefined;

	const title = 'Игры';
	const description =
		'Коллекция игр от сообщества RGD. Инди-игры, джемы, эксперименты и проекты участников.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createApi({ fetch });
	const games = await api.listPublishedGames({ limit: 20, tag }).catch(() => null);

	return {
		...pageMetaTags,
		games
	};
};
