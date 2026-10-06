import { definePageMetaTags } from 'svelte-meta-tags';

import { toProjectType } from '$lib/projects/project-type';
import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch, url }) => {
	depends('projects:public-list');
	const tag = url.searchParams.get('tag') || undefined;
	const type = toProjectType(url.searchParams.get('type'));

	const title = 'Проекты';
	const description =
		'Коллекция проектов от сообщества RGD. Игры, сервисы, инструменты и другие проекты участников.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createServerApi({ request, fetch });
	const projects = await api.listPublishedProjects({ limit: 20, tag, type }).catch(() => null);

	return {
		...pageMetaTags,
		projects,
		type
	};
};
