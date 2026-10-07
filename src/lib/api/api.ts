import type {
	ActivityOverview,
	AddEventResponse,
	AddMotdResponse,
	CreateProjectDto,
	CreateProjectUploadDto,
	DonationsPage,
	GolderImportResult,
	GolderListParams,
	GolderMedia,
	GolderMediaPage,
	GolderSourceInfo,
	GolderUpload,
	GuildEventListItem,
	GuildEventName,
	LikeStateDto,
	MembersStats,
	MineProjectsQueryDto,
	MineProjectsResponseDto,
	MotdListItem,
	Patron,
	ProjectDetails,
	ProjectEditor,
	ProjectListQueryDto,
	ProjectListResponseDto,
	ProjectPopularTag,
	ProjectPublicTag,
	ProjectUpload,
	ProjectUploadCreated,
	ReviewListQueryDto,
	ReviewListResponseDto,
	UpdateProfilePayload,
	UpdateProjectDto,
	User,
	UserActivity,
	UserSearchResult,
	VideosPage,
	WalletBalance
} from './api.type';

export type ApiOptions = {
	fetch: typeof fetch;
	baseUrl?: string;
	headers?: Record<string, string>;
};

export const projectDetailsQueryKey = (idOrSlug: string) =>
	['projects', 'details', idOrSlug] as const;

export class ApiHttpError extends Error {
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly details?: unknown
	) {
		super(`HTTP ${status}: ${statusText}`);
		this.name = 'ApiHttpError';
	}
}

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
			let details: unknown;
			try {
				details = await response.json();
			} catch {
				details = undefined;
			}
			throw new ApiHttpError(response.status, response.statusText, details);
		}
		if (response.status === 204) return undefined as T;
		return await (response.json() as Promise<T>);
	}

	function toQueryString(params: Record<string, string | number | undefined | null>): string {
		const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
		if (entries.length === 0) return '';
		return `?${entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')}`;
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
		searchUsers(q: string) {
			return request<UserSearchResult[]>(`/users/search?q=${encodeURIComponent(q)}`);
		},
		getUserProjects(user: string) {
			return request<ProjectListResponseDto>(`/users/${user}/projects`);
		},
		updateMe(payload: UpdateProfilePayload) {
			return request<User>('/users/me', {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		// --- Projects Module ---

		listPublishedProjects(query: ProjectListQueryDto = {}) {
			return request<ProjectListResponseDto>(
				`/projects${toQueryString(query as Record<string, string | number | undefined>)}`
			);
		},
		getPublishedProject(idOrSlug: string) {
			return request<ProjectDetails>(`/projects/${encodeURIComponent(idOrSlug)}`);
		},
		createProjectDraft(payload: CreateProjectDto) {
			return request<ProjectEditor>('/projects', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		createProjectUpload(payload: CreateProjectUploadDto) {
			return request<ProjectUploadCreated>('/projects/uploads', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		completeProjectUpload(id: string) {
			return request<ProjectUpload>(`/projects/uploads/${encodeURIComponent(id)}/complete`, {
				method: 'POST'
			});
		},
		deleteProjectUpload(id: string) {
			return request<void>(`/projects/uploads/${encodeURIComponent(id)}`, { method: 'DELETE' });
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
		updateProjectDraft(id: string, payload: UpdateProjectDto) {
			return request<ProjectEditor>(`/projects/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		deleteProject(id: string) {
			return request<void>(`/projects/${id}`, { method: 'DELETE' });
		},
		getMyProjects(query: MineProjectsQueryDto = {}) {
			return request<MineProjectsResponseDto>(
				`/projects/mine${toQueryString(query as Record<string, string | number | undefined>)}`
			);
		},
		getProjectEditor(id: string) {
			return request<ProjectEditor>(`/projects/${id}/editor`);
		},
		submitForReview(id: string) {
			return request<ProjectEditor>(`/projects/${id}/submit-review`, { method: 'POST' });
		},
		listReviewProjects(query: ReviewListQueryDto = {}) {
			return request<ReviewListResponseDto>(
				`/projects/review${toQueryString(query as Record<string, string | number | undefined>)}`
			);
		},
		getReviewProject(id: string) {
			return request<ProjectEditor>(`/projects/${id}/review`);
		},
		publishReview(id: string, comment?: string) {
			return request<ProjectEditor>(`/projects/${id}/review/publish`, {
				method: 'POST',
				body: comment ? JSON.stringify({ comment }) : undefined,
				headers: comment ? { 'Content-Type': 'application/json' } : undefined
			});
		},
		requestChanges(id: string, comment: string) {
			return request<ProjectEditor>(`/projects/${id}/review/request-changes`, {
				method: 'POST',
				body: JSON.stringify({ comment }),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		transferOwner(id: string, owner_id: string) {
			return request<ProjectEditor>(`/projects/${id}/review/owner`, {
				method: 'PATCH',
				body: JSON.stringify({ owner_id }),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		listTags() {
			return request<ProjectPublicTag[]>('/projects/tags');
		},
		listPopularTags() {
			return request<ProjectPopularTag[]>('/projects/tags/popular');
		},
		getLikeState(id: string) {
			return request<LikeStateDto>(`/projects/${id}/like`);
		},
		likeProject(id: string) {
			return request<LikeStateDto>(`/projects/${id}/like`, { method: 'PUT' });
		},
		unlikeProject(id: string) {
			return request<LikeStateDto>(`/projects/${id}/like`, { method: 'DELETE' });
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
