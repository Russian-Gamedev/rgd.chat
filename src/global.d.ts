/// <reference types="@sveltejs/kit" />

export type Stats = {
	total: number
	online: number
}

export type Patron = {
	id?: string
	username: string
	avatar_url?: string
	amount: number
}

export type Jam = {
	// Example: Архив 2020
	season: string
	title: string
	prize: string
	// Unix timestamp
	start: number
	// Unix timestamp
	end: number
	games: JamEntry[]
}

export type JamEntry = {
	name: string
	author: {
		id?: string
		username: string
		avatar_url?: string
	}
	// Relative image or link
	image?: string
	url?: string
	order?: number
	badge?: {
		title: string
		color: string
	}
}
