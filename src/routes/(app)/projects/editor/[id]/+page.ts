import { definePageMetaTags } from 'svelte-meta-tags';

export const prerender = false;

export const load = () => ({
	...definePageMetaTags({
		title: 'Редактор проекта',
		description: 'Редактирование проекта сообщества RGD.'
	})
});
