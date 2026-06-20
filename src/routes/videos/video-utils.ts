import type { Video } from '$lib/api/api.type';

import type { VideoCard } from './youtube';
import { getYoutubeVideoId } from './youtube';

export function uniqueById(videos: Video[]): Video[] {
	const seenIds = new Set<number>();

	return videos.filter((video) => {
		if (seenIds.has(video.id)) return false;
		seenIds.add(video.id);
		return true;
	});
}

export function toVideoCards(
	video: Video,
	formatAbsoluteDate: (datetime: string) => string,
	formatRelativeTime: (datetime: string) => string
): VideoCard[] {
	return (video.links ?? []).flatMap((link) => {
		if (link.provider?.toLowerCase() !== 'youtube') return [];

		const videoId = getYoutubeVideoId(link.url);
		if (!videoId) return [];

		return [
			{
				key: `${video.id}:${link.url}`,
				source: video,
				absoluteDate: formatAbsoluteDate(video.datetime),
				relativeTime: formatRelativeTime(video.datetime),
				videoId,
				url: link.url,
				thumbnailUrl: link.thumbnail,
				embedTitle: link.title
			}
		];
	});
}
