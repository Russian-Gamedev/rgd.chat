import { readable } from 'svelte/store';
import type { Stats } from 'src/global';
import { browser } from '$app/env';

const url = "https://rgd.terisback.ru/preview";

const default_stats: Stats = {
	members: 2437,
	online: 561,
}

export const stats = readable(default_stats, function start(set) {
	if (browser) {
		const item = localStorage.getItem('stats')
		const data = item ? JSON.parse(item) as Stats : default_stats
		set(data)
		localStorage.setItem('stats', JSON.stringify(data))
	}

	fetch(url).then(
		res => {
			if (res.ok) { return res.json() }
		}
	).then(
		(data: Stats) => {
			if (!data) return;
			set(data)
			if (browser) {
				localStorage.setItem('stats', JSON.stringify(data))
			}
		}
	);
});
