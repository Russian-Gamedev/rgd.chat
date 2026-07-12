import { definePageMetaTags } from 'svelte-meta-tags';

export const prerender = false;

export const load = () => ({
	...definePageMetaTags({
		title: 'Редактор игры',
		description: 'Редактирование игры сообщества RGD.'
	})
});
