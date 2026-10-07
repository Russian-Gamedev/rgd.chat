import { invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';
import type { GolderMedia } from '$lib/api/api.type';
import { uploadViaPresign } from '$lib/api/upload';

export async function uploadGolderMedia(
	file: File,
	name: string,
	tags: string[]
): Promise<GolderMedia> {
	const api = createApi({ fetch });
	return uploadViaPresign(
		file,
		async (file) => {
			const { media, upload } = await api.createGolderUpload({
				name,
				tags,
				contentType: file.type,
				sizeBytes: file.size
			});
			return { media, url: upload.url };
		},
		async ({ media }) => {
			const completed = await api.completeGolderUpload(media.id);
			await invalidate('golder:list');
			return completed;
		}
	);
}

export async function importGolderMediaFromDiscord(
	url: string,
	name: string,
	tags: string[]
): Promise<GolderMedia[]> {
	const api = createApi({ fetch });
	const result = await api.importGolderFromDiscord({ url, name, tags });
	await invalidate('golder:list');
	return result.items;
}
