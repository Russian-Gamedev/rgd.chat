import { invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';
import type { GuildEventName } from '$lib/api/api.type';

export async function addEvent(event: GuildEventName, message: string, attachments: string[]) {
	const api = createApi({ fetch });
	const result = await api.addEvent(
		event,
		message,
		attachments.length > 0 ? attachments : undefined
	);
	await invalidate('events:list');
	await invalidate('auth:me');
	return result;
}
