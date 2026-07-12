import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { ApiHttpError, createApi } from '$lib/api/api';
import { getPublishedGameEntries } from '$lib/api/prerender-entries';

import type { PageLoad } from './$types';

export const ssr = true;
export const prerender = 'auto';
export const csr = true;

export const entries = async () => {
	return getPublishedGameEntries(fetch);
};

export const load: PageLoad = async ({ params, fetch }) => {
	const api = createApi({ fetch });
	const game = await api.getPublishedGame(params.id).catch((err: unknown) => {
		if (err instanceof ApiHttpError && err.status === 404) {
			throw error(404, 'Игра не найдена');
		}

		throw err;
	});

	const title = game.title;
	const description = game.description ? game.description.slice(0, 200) : 'Страница игры';

	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description,
			...(game.image ? { images: [{ url: game.image }] } : {})
		}
	});

	return {
		...pageMetaTags,
		game
	};
};
