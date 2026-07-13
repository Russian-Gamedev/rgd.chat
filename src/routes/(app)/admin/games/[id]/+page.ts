import { createApi } from '$lib/api/api';
import { hasGlobalPermission } from '$lib/auth/permissions';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, parent, depends, params }) => {
	depends(`games:review:${params.id}`);
	const { auth } = await parent();
	if (!auth || !hasGlobalPermission(auth, 'games:review')) return { game: null, published: null };
	const api = createApi({ fetch });
	try {
		const game = await api.getReviewGame(params.id);
		const published = game.has_published_version
			? await api.getPublishedGame(params.id).catch(() => null)
			: null;
		return { game, published };
	} catch {
		return { game: null, published: null };
	}
};
