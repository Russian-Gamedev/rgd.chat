import { createApi } from '$lib/api/api';
import { hasGlobalPermission } from '$lib/auth/permissions';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch, parent, depends }) => {
	depends('games:tags');
	const { auth } = await parent();
	const tags =
		auth && hasGlobalPermission(auth, 'games:review')
			? await createApi({ fetch })
					.listTags()
					.catch(() => null)
			: null;
	return { tags };
};
