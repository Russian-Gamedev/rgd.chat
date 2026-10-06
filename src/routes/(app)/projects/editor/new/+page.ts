import { definePageMetaTags } from 'svelte-meta-tags';

export const prerender = false;

export const load = () => ({
	...definePageMetaTags({ title: 'Новый проект', description: 'Создание проекта сообщества RGD.' })
});
