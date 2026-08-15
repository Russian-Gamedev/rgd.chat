import { goto, invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';

export async function logout() {
	const api = createApi({ fetch });

	try {
		await api.logout();
	} catch {
		// Ignore if endpoint doesn't exist
	}

	await invalidate('auth:me');
	await goto('/');
}

export async function refreshAuth() {
	await invalidate('auth:me');
}
