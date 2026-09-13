import { createServerApi } from '$lib/server/api';
import { SHOW_COMMUNITY_STATS } from '$lib/site-config';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, request, fetch }) => {
	depends('members:stats');

	const api = createServerApi({ request, fetch });
	const stats = await api.getMembersStats().catch(() => null);
	const motd = await api.getMotd().catch(() => ({ motd: '' }));
	const activity = SHOW_COMMUNITY_STATS ? await api.getActivityOverview().catch(() => null) : null;

	return {
		stats,
		motd,
		activity
	};
};
