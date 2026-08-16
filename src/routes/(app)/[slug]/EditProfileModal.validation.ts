import type { ProfileLink, UpdateProfilePayload } from '$lib/api/api.type';
import * as icons from '$lib/assets/icons';

export type EditableProfileLink = ProfileLink & {
	id: number;
};

export const DEFAULT_LINK_ICON = 'IconGlobe';
export const MAX_LINKS = 5;

export function isValidUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

export function normalizeIconKey(value: string) {
	const trimmedValue = value.trim();
	return trimmedValue in icons ? trimmedValue : DEFAULT_LINK_ICON;
}

export function buildProfilePayload(input: {
	bannerAlt: string;
	birthDate: string;
	about: string;
	links: EditableProfileLink[];
}): UpdateProfilePayload {
	const normalizedBannerAlt = normalizeNullableString(input.bannerAlt);

	if (normalizedBannerAlt && !isValidUrl(normalizedBannerAlt)) {
		throw new Error('Укажите корректную ссылку на кастомный баннер.');
	}

	return {
		bannerAlt: normalizedBannerAlt,
		birthDate: input.birthDate ? new Date(`${input.birthDate}T00:00:00.000Z`).toISOString() : null,
		info: {
			about: normalizeNullableString(input.about),
			links: buildLinksPayload(input.links)
		}
	};
}

function normalizeNullableString(value: string) {
	const trimmedValue = value.trim();
	return trimmedValue.length > 0 ? trimmedValue : null;
}

function buildLinksPayload(links: EditableProfileLink[]) {
	const filledLinks = links
		.map((link) => ({
			label: link.label.trim(),
			icon: normalizeIconKey(link.icon),
			url: link.url.trim()
		}))
		.filter((link) => link.label || link.url || link.icon !== DEFAULT_LINK_ICON);

	for (const link of filledLinks) {
		if (!link.label || !link.icon || !link.url) {
			throw new Error('Заполните label, icon и url у каждой ссылки.');
		}

		if (!isValidUrl(link.url)) {
			throw new Error('Укажите корректный URL для каждой ссылки.');
		}
	}

	return filledLinks;
}
