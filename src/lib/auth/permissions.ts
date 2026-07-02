import type { Permission, User } from '$lib/api/api.type';

export function hasPermission(
	auth: User | null | undefined,
	permission: Permission,
	scope?: string | null
): boolean {
	if (!auth) return false;

	if (auth.permissions.global.includes(permission)) {
		return true;
	}

	if (scope && auth.permissions.guilds[scope]?.includes(permission)) {
		return true;
	}

	return false;
}

export function hasGlobalPermission(
	auth: User | null | undefined,
	permission: Permission
): boolean {
	return hasPermission(auth, permission, null);
}

export function hasGuildPermission(
	auth: User | null | undefined,
	guildId: string,
	permission: Permission
): boolean {
	return hasPermission(auth, permission, guildId);
}
