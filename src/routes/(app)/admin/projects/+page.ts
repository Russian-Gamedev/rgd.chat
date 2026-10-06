import { createApi } from '$lib/api/api';
import { hasGlobalPermission } from '$lib/auth/permissions';
import { parseReviewFilters, reviewQuery } from '$lib/projects/review-utils';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, parent, depends, url }) => {
	depends('projects:review');
	const { auth } = await parent();
	const filters = parseReviewFilters(url.searchParams);
	const projects =
		auth && hasGlobalPermission(auth, 'projects:review')
			? await createApi({ fetch })
					.listReviewProjects(reviewQuery(filters))
					.catch(() => null)
			: null;
	return { projects, filters };
};
