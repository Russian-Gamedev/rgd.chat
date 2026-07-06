import { invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';

export async function login() {
	window.location.href = import.meta.env.VITE_AUTH_URL;
}

export async function logout() {
	const api = createApi({ fetch });

	try {
		await api.logout();
	} catch {
		// Ignore if endpoint doesn't exist
	}

	await invalidate('auth:me');
	window.location.href = '/';
}

export async function refreshAuth() {
	await invalidate('auth:me');
}

export function requireAuth(user: unknown | null) {
	if (typeof window !== 'undefined' && !user) {
		window.location.href = import.meta.env.VITE_AUTH_URL;
	}
}
