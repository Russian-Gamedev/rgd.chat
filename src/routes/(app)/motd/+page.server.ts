import { definePageMetaTags } from 'svelte-meta-tags';

import { redirect } from '@sveltejs/kit';

import { createServerApi } from '$lib/server/api';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, request, fetch, depends }) => {
	depends('motd:list');

	const { auth } = await parent();
	if (!auth) {
		throw redirect(302, import.meta.env.VITE_AUTH_URL || '/');
	}

	const title = 'MOTD';
	const description =
		'Смешнявки в статусе бота, которые меняются каждую минуту. Можно добавить свои через /motd add.';
	const pageMetaTags = definePageMetaTags({
		title,
		description,
		openGraph: {
			title,
			description
		}
	});

	const api = createServerApi({ request, fetch });
	const result = await api.getMotdList().catch(() => null);
	const motdList =
		result === null ? null : Array.isArray(result) ? result : (result.motdList ?? null);

	return {
		...pageMetaTags,
		motdList
	};
};
