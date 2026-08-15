import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch }) => {
	depends('members:stats');

	const api = createServerApi({ request, fetch });
	const stats = await api.getMembersStats().catch(() => null);
	const motd = await api.getMotd().catch(() => ({ motd: '' }));

	return {
		stats,
		motd
	};
};
