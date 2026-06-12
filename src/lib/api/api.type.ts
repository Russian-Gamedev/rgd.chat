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
