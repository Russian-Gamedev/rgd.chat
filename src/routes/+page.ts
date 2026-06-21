import { createApi } from '$lib/api/api';
import { IconJam, IconVK, IconYoutube } from '$lib/assets/icons';

import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ depends, fetch }) => {
	depends('members:stats');
	const api = createApi({ fetch });
	const stats = await api.getMembersStats().catch(() => null);
	const motd = await api.getMotd().catch(() => ({ motd: '' }));

	const cards = [
		{
			icon: IconVK,
			title: 'ВКонтакте',
			description: 'Наше сообщество',
			link: 'https://vk.com/rgd_discord'
		},
		{
			icon: IconYoutube,
			title: 'YouTube',
			description: 'Записи подведения итогов джемов',
			link: 'https://www.youtube.com/channel/UCZq4wK7UprpSiJRQLIjtbqw'
		},
		{
			icon: IconJam,
			title: 'Последний джем',
			description: '35 игр, 5 часов прохождения',
			link: 'https://youtu.be/bDBhfamPtvo'
		}
	];

	return {
		stats,
		cards,
		motd
	};
};
