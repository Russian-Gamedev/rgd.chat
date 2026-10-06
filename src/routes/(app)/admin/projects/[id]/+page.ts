import { createApi } from '$lib/api/api';
import { hasGlobalPermission } from '$lib/auth/permissions';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, parent, depends, params }) => {
	depends(`projects:review:${params.id}`);
	const { auth } = await parent();
	if (!auth || !hasGlobalPermission(auth, 'projects:review'))
		return { project: null, published: null };
	const api = createApi({ fetch });
	try {
		const project = await api.getReviewProject(params.id);
		const published = project.workflow.has_published_version
			? await api.getPublishedProject(params.id).catch(() => null)
			: null;
		return { project, published };
	} catch {
		return { project: null, published: null };
	}
};
