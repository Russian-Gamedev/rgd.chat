import { readable } from 'svelte/store';
import type { Stats } from 'src/global';
import { browser } from '$app/env';

const default_stats: Stats = {
	total: 2437,
	online: 561,
}

export const stats = readable(default_stats, function start(set) {
	if (browser) {
		let rec = localStorage.getItem('stats')

		if (rec) {
			set(JSON.parse(rec) as Stats)
		} else {
			set(default_stats)
			localStorage.setItem('stats', JSON.stringify(default_stats))
		}
	}

	const url = "https://rgd-stats.terisback.workers.dev";
	fetch(url).then(
		res => res.json()
	).then(
		data => {
			let rec: Stats = {
				total: +data.approximate_member_count,
				online: +data.approximate_presence_count,
			}
			set(rec)

			if (browser) {
				localStorage.setItem('stats', JSON.stringify(rec))
			}
		}
	);
});
