import { API_ORIGIN } from '$app/env/private';

import { createApi } from '#lib/api/api';

export function createServerApi(event: { fetch: typeof fetch; request: Request }) {
	const cookie = event.request.headers.get('cookie');

	return createApi({
		fetch: event.fetch,
		baseUrl: API_ORIGIN,
		headers: cookie ? { cookie } : {}
	});
}
