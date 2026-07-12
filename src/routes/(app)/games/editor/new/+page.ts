import { definePageMetaTags } from 'svelte-meta-tags';

export const prerender = false;

export const load = () => ({
	...definePageMetaTags({ title: 'Новая игра', description: 'Создание игры сообщества RGD.' })
});
