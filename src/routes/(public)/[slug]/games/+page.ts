import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { ApiHttpError, createApi } from '$lib/api/api';
import { getKnownProfileEntries } from '$lib/api/prerender-entries';

import type { PageLoad } from './$types';

export const ssr = true;
export const prerender = 'auto';
export const csr = true;

export const entries = async () => {
	return getKnownProfileEntries(fetch);
};

export const load: PageLoad = async ({ params, depends, fetch }) => {
	depends('user:games');

	const api = createApi({ fetch });

	const user = await api.getUser(params.slug).catch((err: unknown) => {
		if (err instanceof ApiHttpError && err.status === 404) {
			throw error(404, 'Пользователь не найден');
		}

		throw err;
	});

	const games = await api.getUserGames(params.slug).catch(() => null);

	const title = `Игры — ${user.nickname ?? user.username}`;
	const description = `Игры пользователя ${user.nickname ?? user.username} на RGD.`;
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	return {
		...pageMetaTags,
		user,
		games
	};
};
