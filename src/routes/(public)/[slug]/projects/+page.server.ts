import { definePageMetaTags } from 'svelte-meta-tags';

import { error } from '@sveltejs/kit';

import { ApiHttpError } from '$lib/api/api';
import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends, request, fetch }) => {
	depends(`users:${params.slug}:projects`);

	const api = createServerApi({ request, fetch });

	const user = await api.getUser(params.slug).catch((err: unknown) => {
		if (err instanceof ApiHttpError && err.status === 404) {
			throw error(404, 'Пользователь не найден');
		}

		throw err;
	});

	const projects = await api.getUserProjects(params.slug).catch(() => null);

	const title = `Проекты — ${user.nickname ?? user.username}`;
	const description = `Проекты пользователя ${user.nickname ?? user.username} на RGD.`;
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	return {
		...pageMetaTags,
		user,
		projects
	};
};
