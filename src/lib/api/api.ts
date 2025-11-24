import type { MembersStats } from './api.type';

export class API {
	static readonly baseUrl = import.meta.env.VITE_API_BASE_URL;

	static getMembersStats() {
		return this.request<MembersStats>('/discord/members');
	}

	static request<T>(endpoint: string, options?: RequestInit): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		return fetch(url, options).then((response) => response.json() as Promise<T>);
	}
}
