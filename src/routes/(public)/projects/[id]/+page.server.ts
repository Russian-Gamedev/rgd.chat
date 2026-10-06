import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { ApiHttpError, projectDetailsQueryKey } from '$lib/api/api';
import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends, request, fetch }) => {
	depends(`projects:details:${projectDetailsQueryKey(params.id).at(-1)}`);

	const api = createServerApi({ request, fetch });
	const project = await api.getPublishedProject(params.id).catch((err: unknown) => {
		if (err instanceof ApiHttpError && err.status === 404) {
			throw error(404, 'Проект не найден');
		}

		throw err;
	});

	const title = project.title;
	const description = project.description ? project.description.slice(0, 200) : 'Страница проекта';

	const pageMetaTags = definePageMetaTags({
		title,
		description,
		canonical: `/projects/${project.slug}`,
		openGraph: {
			title,
			description,
			...(project.thumbnail ? { images: [{ url: project.thumbnail }] } : {})
		}
	});

	return {
		...pageMetaTags,
		project
	};
};
