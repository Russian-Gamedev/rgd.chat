import type {
	GameAttachmentInputDto,
	GameAuthor,
	GameDetails,
	GameEditor,
	GameLinkInputDto,
	GamePublicTag
} from '$lib/api/api.type';

export type ReviewFilters = {
	status: 'review' | 'draft' | 'published';
	search: string;
	ownerId: string;
	offset: number;
};

export function parseReviewFilters(params: URLSearchParams): ReviewFilters {
	const status = params.get('status');
	return {
		status: status === 'draft' || status === 'published' ? status : 'review',
		search: params.get('search') ?? '',
		ownerId: params.get('owner_id') ?? '',
		offset: Math.max(0, Number(params.get('offset')) || 0)
	};
}

export function reviewQuery(filters: ReviewFilters, limit = 20) {
	return {
		limit,
		offset: filters.offset,
		status: filters.status,
		search: filters.search || undefined,
		owner_id: filters.ownerId || undefined
	};
}

export function isPositiveDiscordId(value: string): boolean {
	return /^[1-9]\d*$/.test(value.trim());
}

export function validReviewComment(value: string): boolean {
	const length = value.trim().length;
	return length > 0 && length <= 2000;
}

export function reviewWaitingClass(submittedAt: string | null): 'neutral' | 'warning' | 'critical' {
	if (!submittedAt) return 'neutral';
	const ageHours = Math.max(0, Date.now() - Date.parse(submittedAt)) / 3_600_000;
	if (ageHours >= 72) return 'critical';
	if (ageHours >= 24) return 'warning';
	return 'neutral';
}

export function isAllowedIcon(value: string): boolean {
	return /^Icon[A-Z][A-Za-z0-9]*$/.test(value);
}

export function safeExternalVideoUrl(value: string): string | null {
	try {
		const url = new URL(value);
		if (url.protocol !== 'https:') return null;
		if (url.hostname === 'youtube.com' || url.hostname === 'www.youtube.com') {
			const id = url.searchParams.get('v');
			return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
		}
		if (url.hostname === 'youtu.be') {
			const id = url.pathname.slice(1).split('/')[0];
			return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
		}
		return null;
	} catch {
		return null;
	}
}

export function safeLinkHost(value: string): string {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' ? url.host : 'Недоступная ссылка';
	} catch {
		return 'Недоступная ссылка';
	}
}

type Revision = Pick<
	GameEditor,
	'title' | 'description' | 'tags' | 'credits' | 'resources' | 'metadata'
>;

export type RevisionDiff = {
	field: string;
	working: string;
	published: string;
	changed: boolean;
};

function names(
	items: Array<GamePublicTag | GameAuthor | GameLinkInputDto | GameAttachmentInputDto>
) {
	return items.map((item) => {
		if ('slug' in item) return item.slug;
		if ('type' in item && item.type === 'discord') return `discord:${item.discord_user_id}`;
		if ('type' in item && item.type === 'text') return `text:${item.name.trim().toLowerCase()}`;
		if ('link' in item) return item.link;
		return `${item.type}:${item.url}`;
	});
}

export function compareRevisions(working: Revision, published: GameDetails | null): RevisionDiff[] {
	if (!published) return [];
	const fields: Array<[string, string, string]> = [
		['Название', working.title, published.title],
		['Описание', working.description, published.description],
		['Дата релиза', working.metadata.release_date, published.metadata.release_date],
		['Теги', names(working.tags).join(', '), names(published.tags).join(', ')],
		['Авторы', names(working.credits.authors).join(', '), names(published.credits.authors).join(', ')],
		['Ссылки', names(working.resources.links).join(', '), names(published.resources.links).join(', ')],
		[
			'Вложения',
			names(working.resources.attachments).join(', '),
			names(published.resources.attachments).join(', ')
		]
	];
	return fields.map(([field, next, old]) => ({
		field,
		working: next,
		published: old,
		changed: next !== old
	}));
}
