import type { User } from '$lib/api/api.type';

export const auth = $state<{ user: User | null }>({ user: null });

export function setAuth(u: User | null) {
	auth.user = u;
}
