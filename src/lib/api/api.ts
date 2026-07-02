import type { MembersStats, Patron, User, VideosPage } from './api.type';

export type ApiOptions = {
	fetch: typeof fetch;
	baseUrl?: string;
};

export function createApi(options: ApiOptions) {
	const baseUrl = options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? 'https://bot.rgd.chat';
	const fetcher = options.fetch;

	async function request<T>(endpoint: string, requestOptions: RequestInit = {}): Promise<T> {
		const url = `${baseUrl}${endpoint}`;
		Object.assign(requestOptions, {
			credentials: 'include'
		});
		const response = await fetcher(url, requestOptions);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		return await (response.json() as Promise<T>);
	}

	return {
		getMembersStats() {
			return request<MembersStats>('/discord/members');
		},
		getVideos(page = 1, perPage = 10) {
			return request<VideosPage>(`/videos/GameDevVideos?page=${page}&perPage=${perPage}`);
		},
		getPatrons() {
			return request<Patron[]>('/patrons');
		},
		getMe() {
			return request<User>('/users/me');
		},
		getMotd() {
			return request<{ motd: string }>('/motd');
		}
	};
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
	///@ts-expect-error
	window.api = createApi({ fetch });
}
