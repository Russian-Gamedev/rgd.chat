export interface MembersStats {
	online: number;
	total: number;
}

export type Video = {
	id: number;
	text?: string;
	links?: VideoEmbed[];
	datetime: string;
};

export type VideoEmbed = {
	url: string;
	provider: string;
	title: string;
	description: string;
	thumbnail: string;
};

export type VideosPage = {
	items: Video[];
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
};

export type Patron = {
	value: number;
	user: {
		id: string;
		username: string;
		avatar_url: string;
		banner: string;
	};
};

export type User = {
	id: string;
	username: string;
	nickname: string | null;
	avatar_url: string;
	about: string | null;
	banner: string | null;
	banner_alt: string | null;
	banner_color: string;
	birth_date: string | null;
	first_joined_at: string;
	last_active_at: string;
	active_streak: number;
	max_active_streak: number;
};
