import { definePageMetaTags } from 'svelte-meta-tags';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch, url }) => {
	depends('projects:public-list');
	const tag = url.searchParams.get('tag') || undefined;

	const title = 'Проекты';
	const description =
		'Коллекция проектов от сообщества RGD. Игры, сервисы, утилиты и другие проекты участников.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createServerApi({ request, fetch });
	const projects = await api.listPublishedProjects({ limit: 20, tag }).catch(() => null);

	return {
		...pageMetaTags,
		projects
	};
};
