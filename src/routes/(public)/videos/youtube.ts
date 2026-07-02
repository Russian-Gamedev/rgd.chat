import type { Video } from '$lib/api/api.type';

export type VideoCard = {
	key: string;
	source: Video;
	absoluteDate: string;
	relativeTime: string;
	videoId: string;
	url: string;
	thumbnailUrl: string;
	embedTitle: string;
};

export function getYoutubeVideoId(url: string): string | null {
	try {
		const u = new URL(url);
		const host = u.hostname.replace(/^www\./, '');

		if (!['youtube.com', 'm.youtube.com', 'youtu.be', 'music.youtube.com'].includes(host)) {
			return null;
		}

		const id = u.searchParams.get('v') ?? u.pathname.split('/').filter(Boolean).pop();
		return /^[a-zA-Z0-9_-]{11}$/.test(id?.trim() ?? '') ? (id?.trim() ?? null) : null;
	} catch {
		return null;
	}
}
