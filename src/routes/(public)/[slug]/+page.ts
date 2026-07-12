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
	depends('user:profile');

	const api = createApi({ fetch });

	const user = await api.getUser(params.slug).catch((err: unknown) => {
		if (err instanceof ApiHttpError && err.status === 404) {
			throw error(404, 'Пользователь не найден');
		}

		throw err;
	});

	let currentUser: typeof user | null = null;
	try {
		currentUser = await api.getMe();
	} catch {
		// Not authenticated
	}

	const title = user.nickname ?? user.username;
	const description = user.about ?? `Профиль пользователя ${title}`;
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: `${import.meta.env.VITE_EMBED_URL}/users/${user.username}/card`,
					width: 1200,
					height: 152
				}
			]
		},
		twitter: {
			cardType: 'summary_large_image',
			image: `${import.meta.env.VITE_EMBED_URL}/users/${user.username}/card`
		}
	});

	return {
		...pageMetaTags,
		user,
		currentUser
	};
};
