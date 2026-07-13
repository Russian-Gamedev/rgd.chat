import { createApi } from '$lib/api/api';
import { hasGlobalPermission } from '$lib/auth/permissions';
import { parseReviewFilters, reviewQuery } from '$lib/games/review-utils';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, parent, depends, url }) => {
	depends('games:review');
	const { auth } = await parent();
	const filters = parseReviewFilters(url.searchParams);
	const games =
		auth && hasGlobalPermission(auth, 'games:review')
			? await createApi({ fetch })
					.listReviewGames(reviewQuery(filters))
					.catch(() => null)
			: null;
	return { games, filters };
};
