import { definePageMetaTags } from 'svelte-meta-tags';

import { error, redirect } from '@sveltejs/kit';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, request, fetch, parent }) => {
	const { auth } = await parent();
	if (!auth) {
		throw redirect(302, import.meta.env.VITE_AUTH_URL || '/');
	}

	const api = createServerApi({ request, fetch });
	const media = await api.getGolderMedia(params.slug).catch(() => null);
	if (!media) {
		throw error(404, 'Медиа не найдено.');
	}

	const title = media.slug;
	const description = `Медиа из библиотеки сообщества: ${media.slug}.`;
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description,
			images: media.contentType.startsWith('image/') ? [{ url: media.url }] : undefined
		}
	});

	return {
		...pageMetaTags,
		media
	};
};
