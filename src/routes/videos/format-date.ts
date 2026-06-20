export const relativeTimeDivisions = [
	{ amount: 60, unit: 'second' },
	{ amount: 60, unit: 'minute' },
	{ amount: 24, unit: 'hour' },
	{ amount: 7, unit: 'day' },
	{ amount: 4.34524, unit: 'week' },
	{ amount: 12, unit: 'month' },
	{ amount: Number.POSITIVE_INFINITY, unit: 'year' }
] as const satisfies readonly {
	amount: number;
	unit: Intl.RelativeTimeFormatUnit;
}[];

export function formatAbsoluteDate(datetime: string, locale: string): string {
	const date = new Date(datetime);
	if (Number.isNaN(date.getTime())) return datetime;

	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
}

export function formatRelativeDateTime(datetime: string, locale: string, now: number): string {
	const date = new Date(datetime);
	const timestamp = date.getTime();

	if (Number.isNaN(timestamp)) return datetime;

	const formatter = new Intl.RelativeTimeFormat(locale, {
		numeric: 'auto',
		style: 'long'
	});

	let duration = (timestamp - now) / 1000;

	for (const division of relativeTimeDivisions) {
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.unit);
		}

		duration /= division.amount;
	}

	return formatter.format(Math.round(duration), 'year');
}
