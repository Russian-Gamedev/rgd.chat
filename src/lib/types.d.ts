import type { OutputData as Content } from "@editorjs/editorjs";

export type Jam = {
	id: string;
	slug: string;
	title: string;
	teaser: string;
	thumbnail: string;
	stream_embed?: string;
	theme?: string;
	prize_fund?: number;
	start_date?: string;
	end_date?: string;
	content?: Content;
}

export type Sponsor = {
	user_id: string;
	avatar_url?: string;
	username: string;
	discriminator?: string;
	amount: number;
};
