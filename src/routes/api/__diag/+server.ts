import { env } from '$env/dynamic/private';
import { createServerApi } from '$lib/server/api';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const cookie = event.request.headers.get('cookie');
	const cookieNames = cookie
		? cookie.split(';').map((c) => c.trim().split('=')[0])
		: [];

	let apiResult: unknown;
	let apiStatus: string;
	try {
		const api = createServerApi(event);
		apiResult = await api.getMe();
		apiStatus = 'ok';
	} catch (error) {
		apiResult = error instanceof Error ? error.message : String(error);
		apiStatus = 'error';
	}

	let rawResult: unknown;
	let rawStatus: string;
	try {
		const headers = new Headers();
		if (cookie) headers.set('cookie', cookie);
		const raw = await event.fetch('https://bot.rgd.chat/users/me', {
			headers,
			credentials: 'include'
		});
		rawResult = {
			httpStatus: raw.status,
			body: (await raw.text()).slice(0, 500)
		};
		rawStatus = 'ok';
	} catch (error) {
		rawResult = error instanceof Error ? error.message : String(error);
		rawStatus = 'error';
	}

	return Response.json({
		apiOrigin: env.API_ORIGIN ?? null,
		serverSawCookie: cookie ? true : false,
		cookieNames,
		createServerApiGetMe: { status: apiStatus, result: apiResult },
		rawEventFetch: { status: rawStatus, result: rawResult }
	});
};
