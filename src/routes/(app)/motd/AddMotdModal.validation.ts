export function normalizeMotdContent(value: string) {
	return value.trim();
}

export function isEmptyMotdContent(value: string) {
	return value.trim().length === 0;
}
