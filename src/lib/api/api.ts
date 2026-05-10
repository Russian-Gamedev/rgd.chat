import type { MembersStats } from './api.type';

export class API {
	static readonly baseUrl = import.meta.env.VITE_API_BASE_URL;
	private static fetcher = fetch;

	static getMembersStats() {
		return this.request<MembersStats>('/discord/members');
	}

	static use(fetcher: typeof fetch) {
		this.fetcher = fetcher;
		return this;
	}

	static request<T>(endpoint: string, options?: RequestInit): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		return this.fetcher(url, options).then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return response.json() as Promise<T>;
		});
	}
}
