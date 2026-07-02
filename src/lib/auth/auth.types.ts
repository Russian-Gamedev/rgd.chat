import type { Permission, User } from '$lib/api/api.type';

export type { Permission };

export type PermissionsMap = Record<string, Permission[]>;

export type AuthUser = {
	id: string;
	username: string;
	nickname: string | null;
	avatarUrl: string;
};

export type AuthSnapshot = User | null;
