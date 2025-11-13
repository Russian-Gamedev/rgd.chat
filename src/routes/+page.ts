import { API } from '$lib/api/api';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ depends }) => {
	depends('members:stats');
	return API.getMembersStats();
};
