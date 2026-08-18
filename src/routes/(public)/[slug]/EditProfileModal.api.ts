import { invalidate } from '$app/navigation';
import { createApi } from '$lib/api/api';
import type { UpdateProfilePayload } from '$lib/api/api.type';

export async function updateProfile(payload: UpdateProfilePayload) {
	const api = createApi({ fetch });
	const updatedUser = await api.updateMe(payload);
	await invalidate('user:profile');
	return updatedUser;
}
