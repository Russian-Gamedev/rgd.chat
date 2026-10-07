/**
 * Общий поток прямой загрузки файла в хранилище: presigned PUT → подтверждение.
 * `create` создаёт запись загрузки и возвращает presigned URL (плюс любой
 * контекст, нужный для `complete`).
 */
export async function uploadViaPresign<TCreate extends { url: string }, TResult>(
	file: File,
	create: (file: File) => Promise<TCreate>,
	complete: (created: TCreate, file: File) => Promise<TResult>
): Promise<TResult> {
	const created = await create(file);
	const response = await fetch(created.url, {
		method: 'PUT',
		body: file,
		headers: { 'Content-Type': file.type }
	});
	if (!response.ok) {
		throw new Error(`Не удалось загрузить файл в хранилище (HTTP ${response.status}).`);
	}
	return complete(created, file);
}
