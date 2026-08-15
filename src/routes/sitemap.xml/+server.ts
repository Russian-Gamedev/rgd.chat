import { createServerApi } from '$lib/server/api';
import { SITE_URL } from '$lib/site-config';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const api = createServerApi(event);
	const patrons = await api.getPatrons().catch(() => []);

	const routes = [
		'/',
		'/patrons',
		'/videos',
		...patrons.map((patron) => `/${patron.user.username}`)
	];
	const urls = routes.map((route) => `\t<url><loc>${SITE_URL}${route}</loc></url>`).join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
