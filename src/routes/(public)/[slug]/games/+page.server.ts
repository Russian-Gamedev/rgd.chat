import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { ApiHttpError } from '$lib/api/api';
import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends, request, fetch }) => {
	depends(`users:${params.slug}:games`);

	const api = createServerApi({ request, fetch });

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
