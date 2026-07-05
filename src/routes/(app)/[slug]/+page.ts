import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { createApi } from '$lib/api/api';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, depends, fetch }) => {
	depends('user:profile');

	const api = createApi({ fetch });

	const user = await api.getUser(params.slug).catch(() => {
		throw error(404, 'Пользователь не найден');
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
		openGraph: { title, description }
	});

	return {
		...pageMetaTags,
		user,
		currentUser
	};
};
