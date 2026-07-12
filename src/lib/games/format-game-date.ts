export function formatGameDate(value: string, locale = 'ru-RU'): string {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return value;
	const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
