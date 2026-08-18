import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { ApiHttpError, gameDetailsQueryKey } from '$lib/api/api';
import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends, request, fetch }) => {
	depends(`games:details:${gameDetailsQueryKey(params.id).at(-1)}`);

	const api = createServerApi({ request, fetch });
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
		canonical: `/games/${game.slug}`,
		openGraph: {
			title,
			description,
			...(game.thumbnail ? { images: [{ url: game.thumbnail }] } : {})
		}
	});

	return {
		...pageMetaTags,
		game
	};
};
