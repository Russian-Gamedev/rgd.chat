/**
 * Общий поток прямой загрузки файла в хранилище: presigned PUT → подтверждение.
 * `create` создаёт запись загрузки и возвращает presigned URL (плюс любой
 * контекст, нужный для `complete`). `onProgress` сообщает процент загрузки (0–100).
 */
export async function uploadViaPresign<TCreate extends { url: string }, TResult>(
	file: File,
	create: (file: File) => Promise<TCreate>,
	complete: (created: TCreate, file: File) => Promise<TResult>,
	onProgress?: (percent: number) => void
): Promise<TResult> {
	const created = await create(file);
	try {
		await new Promise<void>((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('PUT', created.url);
			request.setRequestHeader('Content-Type', file.type);
			request.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					onProgress?.(Math.round((event.loaded / event.total) * 100));
				}
			};
			request.onload = () => {
				if (request.status >= 200 && request.status < 300) resolve();
				else reject(new Error(`Не удалось загрузить файл в хранилище (HTTP ${request.status}).`));
			};
			request.onerror = () => reject(new Error('Не удалось загрузить файл в хранилище.'));
			request.send(file);
		});
	} catch (error) {
		onProgress?.(0);
		throw error;
	}
	return complete(created, file);
}
