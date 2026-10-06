import { definePageMetaTags } from 'svelte-meta-tags';

import { redirect } from '@sveltejs/kit';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch, parent }) => {
	depends('golder:list');

	const { auth } = await parent();
	if (!auth) {
		throw redirect(302, import.meta.env.VITE_AUTH_URL || '/');
	}

	const title = 'Golder';
	const description =
		'Общая медиабиблиотека сообщества: картинки, видео и аудио с тегами. Загружайте своё и находите нужное по поиску и тегам.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createServerApi({ request, fetch });
	const media = await api.listGolder().catch(() => null);

	return {
		...pageMetaTags,
		media
	};
};
