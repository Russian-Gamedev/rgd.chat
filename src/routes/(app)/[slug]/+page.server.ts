import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends, parent, request, fetch }) => {
	depends('user:profile');

	const { auth } = await parent();
	const currentUser = auth;

	const api = createServerApi({ request, fetch });

	const user = await api.getUser(params.slug).catch(() => {
		throw error(404, 'Пользователь не найден');
	});

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
