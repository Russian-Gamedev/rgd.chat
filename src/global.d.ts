/// <reference types="@sveltejs/kit" />

export type Stats = {
	total: number
	online: number
}

export type Patron = {
	id?: string
	username: string
	avatar_url?: string
	banner_url?: string
	banner_color?: string
	amount: number
}

export type Jam = {
	// Example: kojima-jam
	slug: string
	// Example: Архив 2020
	season: string
	title: string
	display_title?: string
	display_desc?: string
	prize: string
	thumbnail?: string
	stream?: string
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
		tooltip?: string
		color: string
	}
}

export type BreadcrumbPart = {
	title: string
	href: string
}
