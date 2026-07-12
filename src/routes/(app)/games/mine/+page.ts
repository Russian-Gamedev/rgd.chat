import { definePageMetaTags } from 'svelte-meta-tags';

import { createApi } from '$lib/api/api';
import type { GameRevisionStatus } from '$lib/api/api.type';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ depends, fetch, parent, url }) => {
	depends('games:mine');
	const { auth } = await parent();
	const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
	const rawStatus = url.searchParams.get('status');
	const status: GameRevisionStatus | undefined = ['draft', 'review', 'published'].includes(
		rawStatus ?? ''
	)
		? (rawStatus as GameRevisionStatus)
		: undefined;
	const games = auth
		? await createApi({ fetch })
				.getMyGames({ limit: 20, offset, status })
				.catch(() => null)
		: null;

	return {
		...definePageMetaTags({
			title: 'Мои игровые проекты',
			description: 'Черновики, ревью и опубликованные игры.'
		}),
		games,
		status
	};
};
