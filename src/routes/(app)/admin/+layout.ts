import type { LayoutLoad } from './$types';

export const prerender = false;

export const load: LayoutLoad = async ({ depends }) => {
	depends('auth:me');
	return {};
};
