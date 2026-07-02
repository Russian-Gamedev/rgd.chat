import { createApi } from '$lib/api/api';

import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async ({ fetch, depends }) => {
	depends('auth:me');

	const api = createApi({ fetch });

	try {
		const auth = await api.getMe();
		return { auth };
	} catch {
		return { auth: null };
	}
};
