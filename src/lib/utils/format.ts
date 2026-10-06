export function formatNumber(value: number) {
	return new Intl.NumberFormat('ru-RU').format(value);
}

export function formatVoiceDuration(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.round((seconds % 3600) / 60);

	return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
}

export function formatDateFull(dateKey: string) {
	return new Date(`${dateKey}T00:00:00`).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}
