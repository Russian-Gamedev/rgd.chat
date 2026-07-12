import { createApi } from './api';

const publishedGamesEntryLimit = 100;
const publishedGamesMaxPages = 10;

export async function getKnownProfileEntries(fetcher: typeof fetch) {
	const api = createApi({ fetch: fetcher });

	try {
		const patrons = await api.getPatrons();
		const usernames = new Set(patrons.map((patron) => patron.user.username).filter(Boolean));
		return [...usernames].map((slug) => ({ slug }));
	} catch {
		return [];
	}
}

export async function getPublishedGameEntries(fetcher: typeof fetch) {
	const api = createApi({ fetch: fetcher });
	const entries: { id: string }[] = [];

	try {
		for (let page = 0; page < publishedGamesMaxPages; page += 1) {
			const games = await api.listPublishedGames({
				limit: publishedGamesEntryLimit,
				offset: page * publishedGamesEntryLimit
			});

			entries.push(...games.items.map((game) => ({ id: game.id })));

			if (games.offset + games.limit >= games.total) break;
		}
	} catch {
		return entries;
	}

	return entries;
}
