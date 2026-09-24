import type {
	ActivityOverview,
	AddEventResponse,
	AddMotdResponse,
	DonationsPage,
	GolderImportResult,
	GolderListParams,
	GolderMedia,
	GolderMediaPage,
	GolderSourceInfo,
	GolderUpload,
	GuildEventListItem,
	GuildEventName,
	MembersStats,
	MotdListItem,
	Patron,
	UpdateProfilePayload,
	User,
	UserActivity,
	VideosPage,
	WalletBalance
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
		getDonations(page = 1, perPage = 20) {
			return request<DonationsPage>(
				`https://thanks.rgd.chat/api/donations?page=${page}&per_page=${perPage}`
			);
		},
		getMe() {
			return request<User>('/users/me');
		},
		getWalletBalance() {
			return request<WalletBalance>('/wallet/balance');
		},
		getMotd() {
			return request<{ motd: string }>('/motd');
		},
		getMotdList() {
			return request<{ motdList: MotdListItem[] }>('/motd/list');
		},
		addMotd(content: string) {
			return request<AddMotdResponse>('/motd', {
				method: 'POST',
				body: JSON.stringify({ content }),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		getEventsList() {
			return request<GuildEventListItem[]>('/events/list');
		},
		addEvent(event: GuildEventName, message: string) {
			return request<AddEventResponse>('/events', {
				method: 'POST',
				body: JSON.stringify({ event, message }),
				headers: { 'Content-Type': 'application/json' }
			});
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
		},
		getMyActivity(months?: number) {
			return request<UserActivity>(withMonthsQuery('/activity/me', months));
		},
		getUserActivity(user: string, months?: number) {
			return request<UserActivity>(withMonthsQuery(`/activity/users/${user}`, months));
		},
		getActivityOverview(months?: number) {
			return request<ActivityOverview>(withMonthsQuery('/activity/overview', months));
		},
		listGolder(params: GolderListParams = {}) {
			const query = new URLSearchParams(
				Object.entries(params)
					.filter(([, value]) => value !== undefined && value !== '')
					.map(([key, value]) => [key, String(value)])
			);
			const queryString = query.toString();

			return request<GolderMediaPage>(`/golder${queryString ? `?${queryString}` : ''}`);
		},
		getGolderMedia(slug: string) {
			return request<GolderMedia>(`/golder/${encodeURIComponent(slug)}`);
		},
		suggestGolderTags(query: string) {
			return request<string[]>(`/golder/tags?q=${encodeURIComponent(query)}`);
		},
		createGolderUpload(payload: {
			name: string;
			tags: string[];
			contentType: string;
			sizeBytes: number;
		}) {
			return request<GolderUpload>('/golder/uploads', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		completeGolderUpload(id: string) {
			return request<GolderMedia>(`/golder/uploads/${id}/complete`, { method: 'POST' });
		},
		resolveGolderImportSource(url: string) {
			return request<GolderSourceInfo>(`/golder/import/resolve?url=${encodeURIComponent(url)}`);
		},
		importGolderFromDiscord(payload: { url: string; name: string; tags: string[] }) {
			return request<GolderImportResult>('/golder/import', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		}
	};
}

function withMonthsQuery(endpoint: string, months?: number) {
	return months === undefined ? endpoint : `${endpoint}?months=${months}`;
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
	///@ts-expect-error
	window.api = createApi({ fetch });
}
