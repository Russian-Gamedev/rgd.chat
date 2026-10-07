import { createApi } from '$lib/api/api';
import type { ProjectUpload, ProjectUploadKind } from '$lib/api/api.type';
import { uploadViaPresign } from '$lib/api/upload';

/** Должно совпадать с PROJECTS_MAX_UPLOAD_BYTES на бэкенде. */
export const PROJECT_MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export function isSupportedImage(file: File): boolean {
	return file.type.startsWith('image/');
}

export function isAcceptableImageSize(file: File): boolean {
	return file.size > 0 && file.size <= PROJECT_MAX_UPLOAD_BYTES;
}

/** Загружает изображение проекта в S3: presign → PUT → подтверждение. */
export async function uploadProjectImage(
	kind: ProjectUploadKind,
	file: File
): Promise<ProjectUpload> {
	const api = createApi({ fetch });
	return uploadViaPresign(
		file,
		async (file) => {
			const { upload } = await api.createProjectUpload({
				kind,
				content_type: file.type,
				size_bytes: file.size
			});
			return { id: upload.id, url: upload.url };
		},
		({ id }) => api.completeProjectUpload(id)
	);
}
