import { env } from '$env/dynamic/private';
import { createApi } from '$lib/api/api';

const API_ORIGIN = env.API_ORIGIN ?? 'https://bot.rgd.chat';

export function createServerApi(event: { fetch: typeof fetch; request: Request }) {
	const cookie = event.request.headers.get('cookie');

	return createApi({
		fetch: event.fetch,
		baseUrl: API_ORIGIN,
		headers: cookie ? { cookie } : {}
	});
}
