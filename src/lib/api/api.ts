import type {
	CreateGameDto,
	GameDetailsDto,
	GameEditorDto,
	GameListQueryDto,
	GameListResponseDto,
	GameTagDto,
	LikeStateDto,
	MembersStats,
	MineGamesQueryDto,
	MineGamesResponseDto,
	MotdListItem,
	Patron,
	ReviewListResponseDto,
	UpdateGameDto,
	UpdateProfilePayload,
	User,
	VideosPage
} from './api.type';

export type ApiOptions = {
	fetch: typeof fetch;
	baseUrl?: string;
};

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
	const baseUrl = options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? 'https://bot.rgd.chat';
	const fetcher = options.fetch;

	async function request<T>(endpoint: string, requestOptions: RequestInit = {}): Promise<T> {
		const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : endpoint;

		Object.assign(requestOptions, {
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
		getUserGames(user: string) {
			return request<GameListResponseDto>(`/users/${user}/games`);
		},
		updateMe(payload: UpdateProfilePayload) {
			return request<User>('/users/me', {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},

		// --- Games Module ---

		listPublishedGames(query: GameListQueryDto = {}) {
			return request<GameListResponseDto>(
				`/games${toQueryString(query as Record<string, string | number | undefined>)}`
			);
		},
		getPublishedGame(id: string) {
			return request<GameDetailsDto>(`/games/${id}`);
		},
		createGameDraft(payload: CreateGameDto) {
			return request<GameEditorDto>('/games', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		updateGameDraft(id: string, payload: UpdateGameDto) {
			return request<GameEditorDto>(`/games/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		deleteGame(id: string) {
			return request<void>(`/games/${id}`, { method: 'DELETE' });
		},
		getMyGames(query: MineGamesQueryDto = {}) {
			return request<MineGamesResponseDto>(
				`/games/mine${toQueryString(query as Record<string, string | number | undefined>)}`
			);
		},
		getGameEditor(id: string) {
			return request<GameEditorDto>(`/games/${id}/editor`);
		},
		submitForReview(id: string) {
			return request<GameEditorDto>(`/games/${id}/submit-review`, { method: 'POST' });
		},
		listReviewGames(query: GameListQueryDto & MineGamesQueryDto = {}) {
			return request<ReviewListResponseDto>(
				`/games/review${toQueryString(query as Record<string, string | number | undefined>)}`
			);
		},
		getReviewGame(id: string) {
			return request<GameEditorDto>(`/games/${id}/review`);
		},
		publishReview(id: string, comment?: string) {
			return request<GameEditorDto>(`/games/${id}/review/publish`, {
				method: 'POST',
				body: comment ? JSON.stringify({ comment }) : undefined,
				headers: comment ? { 'Content-Type': 'application/json' } : undefined
			});
		},
		requestChanges(id: string, comment: string) {
			return request<GameEditorDto>(`/games/${id}/review/request-changes`, {
				method: 'POST',
				body: JSON.stringify({ comment }),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		transferOwner(id: string, owner_id: string) {
			return request<GameEditorDto>(`/games/${id}/review/owner`, {
				method: 'PATCH',
				body: JSON.stringify({ owner_id }),
				headers: { 'Content-Type': 'application/json' }
			});
		},
		listTags() {
			return request<GameTagDto[]>('/games/tags');
		},
		getLikeState(id: string) {
			return request<LikeStateDto>(`/games/${id}/like`);
		},
		likeGame(id: string) {
			return request<LikeStateDto>(`/games/${id}/like`, { method: 'PUT' });
		},
		unlikeGame(id: string) {
			return request<LikeStateDto>(`/games/${id}/like`, { method: 'DELETE' });
		}
	};
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
	///@ts-expect-error
	window.api = createApi({ fetch });
}
