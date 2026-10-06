import { invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';
import type { GolderMedia } from '$lib/api/api.type';

export async function uploadGolderMedia(
	file: File,
	name: string,
	tags: string[]
): Promise<GolderMedia> {
	const api = createApi({ fetch });
	const { media, upload } = await api.createGolderUpload({
		name,
		tags,
		contentType: file.type,
		sizeBytes: file.size
	});

	const response = await fetch(upload.url, {
		method: 'PUT',
		body: file,
		headers: { 'Content-Type': file.type }
	});
	if (!response.ok) {
		throw new Error(`Не удалось загрузить файл в хранилище (HTTP ${response.status}).`);
	}

	const completed = await api.completeGolderUpload(media.id);
	await invalidate('golder:list');
	return completed;
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
