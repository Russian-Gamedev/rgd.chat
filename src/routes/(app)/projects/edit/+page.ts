import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = ({ url }) => {
	const id = url.searchParams.get('id');
	redirect(307, id ? `/projects/editor/${id}` : '/projects/editor/new');
};
