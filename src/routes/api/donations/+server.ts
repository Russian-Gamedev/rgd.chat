import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

const DONATIONS_URL = 'https://thanks.rgd.chat/api/donations';

// Same-origin passthrough for client-side pagination: thanks.rgd.chat only
// allows CORS from https://rgd.chat, so the browser fetches this instead.
export const GET: RequestHandler = async ({ fetch, url }) => {
	const page = url.searchParams.get('page') ?? '1';
	const perPage = url.searchParams.get('per_page') ?? '20';

	const response = await fetch(`${DONATIONS_URL}?page=${page}&per_page=${perPage}`);

	return json(await response.json(), { status: response.status });
};
