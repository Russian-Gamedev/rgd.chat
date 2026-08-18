import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';

const API_ORIGIN = env.API_ORIGIN ?? 'https://bot.rgd.chat';

const HOP_BY_HOP_HEADERS = new Set([
	'connection',
	'keep-alive',
	'transfer-encoding',
	'content-length',
	'content-encoding',
	'upgrade'
]);

const proxy: RequestHandler = async (event) => {
	const path = event.params.path ?? '';
	const target = `${API_ORIGIN}/${path}${event.url.search}`;

	const headers = new Headers();
	for (const name of ['accept', 'content-type', 'authorization', 'if-none-match']) {
		const value = event.request.headers.get(name);
		if (value) {
			headers.set(name, value);
		}
	}

	const cookie = event.request.headers.get('cookie');
	if (cookie) {
		headers.set('cookie', cookie);
	}

	const isBodyless = event.request.method === 'GET' || event.request.method === 'HEAD';
	const body = isBodyless ? undefined : await event.request.arrayBuffer();

	const response = await event.fetch(target, {
		method: event.request.method,
		headers,
		body
	});

	const responseHeaders = new Headers();
	response.headers.forEach((value, key) => {
		if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
			responseHeaders.set(key, value);
		}
	});

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
