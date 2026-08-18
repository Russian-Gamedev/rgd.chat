import { invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';

export async function addMotd(content: string) {
	const api = createApi({ fetch });
	const result = await api.addMotd(content);
	await invalidate('motd:list');
	await invalidate('auth:me');
	return result;
}
