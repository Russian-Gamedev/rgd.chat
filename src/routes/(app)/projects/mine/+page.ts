import { definePageMetaTags } from 'svelte-meta-tags';

import { createApi } from '$lib/api/api';
import type { ProjectRevisionStatus } from '$lib/api/api.type';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ depends, fetch, parent, url }) => {
	depends('projects:mine');
	const { auth } = await parent();
	const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
	const rawStatus = url.searchParams.get('status');
	const status: ProjectRevisionStatus | undefined = ['draft', 'review', 'published'].includes(
		rawStatus ?? ''
	)
		? (rawStatus as ProjectRevisionStatus)
		: undefined;
	const projects = auth
		? await createApi({ fetch })
				.getMyProjects({ limit: 20, offset, status })
				.catch(() => null)
		: null;

	return {
		...definePageMetaTags({
			title: 'Мои проекты',
			description: 'Черновики, ревью и опубликованные проекты.'
		}),
		projects,
		status
	};
};
