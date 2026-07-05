import { createApi } from '$lib/api/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, fetch }) => {
	depends('members:stats');
	const api = createApi({ fetch });
	const stats = await api.getMembersStats().catch(() => null);
	const motd = await api.getMotd().catch(() => ({ motd: '' }));

	return {
		stats,
		motd
	};
};
