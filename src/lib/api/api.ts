import type {
	MembersStats,
	MotdListItem,
	Patron,
	UpdateProfilePayload,
	User,
	VideosPage
} from './api.type';

export type ApiOptions = {
	fetch: typeof fetch;
	baseUrl?: string;
	headers?: Record<string, string>;
};

export function createApi(options: ApiOptions) {
	const baseUrl = options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? '/api';
	const fetcher = options.fetch;

	async function request<T>(endpoint: string, requestOptions: RequestInit = {}): Promise<T> {
		const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : endpoint;

		const headers = new Headers(options.headers);
		if (requestOptions.headers) {
			const merged = new Headers(requestOptions.headers);
			merged.forEach((value, key) => {
				headers.set(key, value);
			});
		}

		Object.assign(requestOptions, {
			headers,
			credentials: 'include'
		});
		const response = await fetcher(url, requestOptions);
		if (!response.ok) {
			throw new Error(await extractErrorMessage(response));
		}
		return await (response.json() as Promise<T>);
	}

	async function extractErrorMessage(response: Response) {
		const fallback = `HTTP ${response.status}: ${response.statusText}`;

		try {
			const body = await response.json();
			const message = body?.message;
			const text = Array.isArray(message) ? message.join(', ') : message;

			return typeof text === 'string' && text.length > 0 ? text : fallback;
		} catch {
			return fallback;
		}
	}

	return {
		getMembersStats() {
			return request<MembersStats>('/discord/members');
		},
		getVideos(page = 1, perPage = 10) {
			return request<VideosPage>(`/videos/GameDevVideos?page=${page}&perPage=${perPage}`);
		},
		getPatrons() {
			return request<Patron[]>('https://thanks.rgd.chat/api/supporters');
		},
		getMe() {
			return request<User>('/users/me');
		},
		getMotd() {
			return request<{ motd: string }>('/motd');
		},
		getMotdList() {
			return request<{ motdList: MotdListItem[] }>('/motd/list');
		},
		logout() {
			return request<void>('/auth/logout', { method: 'POST' });
		},
		getUser(user: string) {
			return request<User>(`/users/${user}`);
		},
		updateMe(payload: UpdateProfilePayload) {
			return request<User>('/users/me', {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		}
	};
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
	///@ts-expect-error
	window.api = createApi({ fetch });
}
