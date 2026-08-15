import { createServerApi } from '$lib/server/api';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ depends, request, fetch }) => {
	depends('auth:me');

	const api = createServerApi({ request, fetch });
	const auth = await api.getMe().catch(() => null);

	return { auth };
};
