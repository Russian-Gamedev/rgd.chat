import { definePageMetaTags } from 'svelte-meta-tags';

import { createApi } from '$lib/api/api';

import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ depends, fetch }) => {
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

	const api = createApi({ fetch });
	const videos = await api.getVideos().catch(() => null);

	return {
		...pageMetaTags,
		videos
	};
};
