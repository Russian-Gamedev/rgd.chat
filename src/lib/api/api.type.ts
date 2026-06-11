export interface MembersStats {
	online: number;
	total: number;
}

export type Video = {
	id: number;
	text?: string;
	links?: string[];
	views?: number;
	datetime: string;
	editir: boolean;
};

export type VideosPage = {
	items: Video[];
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
};
