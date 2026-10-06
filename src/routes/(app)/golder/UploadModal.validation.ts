export const GOLDER_NAME_MAX_LENGTH = 200;
export const GOLDER_MAX_TAGS = 10;
export const GOLDER_MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const DISCORD_MESSAGE_URL =
	/^https:\/\/([a-z]+\.)?discord(app)?\.com\/channels\/\d{15,21}\/\d{15,21}\/\d{15,21}$/i;

export function isDiscordMessageUrl(value: string): boolean {
	return DISCORD_MESSAGE_URL.test(value.trim());
}

export function isHttpUrl(value: string): boolean {
	return /^https?:\/\/\S+$/i.test(value.trim());
}

export function isSupportedFile(file: File): boolean {
	return /^(image|video|audio)\//.test(file.type);
}

export function isAcceptableSize(bytes: number): boolean {
	return bytes > 0 && bytes <= GOLDER_MAX_UPLOAD_BYTES;
}

export function isNameValid(name: string): boolean {
	const trimmed = name.trim();
	return trimmed.length > 0 && trimmed.length <= GOLDER_NAME_MAX_LENGTH;
}

/** Display name from a filename: "My Cat! 2026.PNG" -> "My Cat! 2026". */
export function nameFromFile(filename: string): string {
	return filename.replace(/\.[^.]+$/, '').slice(0, GOLDER_NAME_MAX_LENGTH);
}
