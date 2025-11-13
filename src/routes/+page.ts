import { API } from '$lib/api/api';
import Jam from '$lib/assets/icons/jam.svelte';
import Vk from '$lib/assets/icons/vk.svelte';
import Youtube from '$lib/assets/icons/youtube.svelte';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ depends }) => {
	depends('members:stats');
	const stats = await API.getMembersStats();
	const cards = [
		{
			icon: Vk,
			title: 'ВКонтакте',
			description: 'Наше сообщество',
			link: 'https://vk.com/rgd_discord'
		},
		{
			icon: Youtube,
			title: 'YouTube',
			description: 'Записи подведения итогов джемов',
			link: 'https://www.youtube.com/channel/UCZq4wK7UprpSiJRQLIjtbqw'
		},
		{
			icon: Jam,
			title: 'Последний джем',
			description: '35 игр, 5 часов прохождения',
			link: 'https://youtu.be/bDBhfamPtvo'
		}
	];
	return { stats, cards };
};
