import { definePageMetaTags } from 'svelte-meta-tags';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch }) => {
	depends('videos:list');

	const title = 'Коллекция полезных видео по разработке игр';
	const description =
		'Подборка полезных видео по разработке игр: геймдизайн, программирование, графика, продакшн, маркетинг, разборы провалов и чужих ошибок. Всё то, что обычно приходится собирать по сотням вкладок, рекомендациям с Discord и случайным комментариям под видео.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createServerApi({ request, fetch });
	const videos = await api.getVideos().catch(() => null);

	return {
		...pageMetaTags,
		videos
	};
};
