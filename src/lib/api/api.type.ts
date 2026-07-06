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

export type Permission =
	| 'wallet:read:own'
	| 'wallet:manage'
	| 'guild:read'
	| 'guild_events:read'
	| 'read:messages'
	| 'send:messages';

export type Permissions = {
	global: Permission[];
	guilds: Record<string, Permission[]>;
};

export type User = {
	id: string;
	username: string;
	nickname: string | null;
	avatarUrl: string;
	about: string | null;
	info?: ProfileInfo | null;
	banner: string | null;
	bannerAlt: string | null;
	bannerColor: string;
	birthDate: string | null;
	firstJoinedAt: string;
	lastActiveAt: string;
	activeStreak: number;
	maxActiveStreak: number;
	permissions: Permissions;
	tags: UserTag[];
};

export type MotdListItem = {
	content: string;
	id: number;
	user: {
		id: string,
		username: string,
		avatar_url: string,
	};
};

export type UserTag = {
	background: string;
	color: string;
	name: string;
	description: string;
};

export type ProfileLink = {
	label: string;
	icon: string;
	url: string;
};

export type ProfileInfo = {
	about: string | null;
	links: ProfileLink[];
};

export type UpdateProfileInfo = ProfileInfo;

export type UpdateProfilePayload = {
	bannerAlt?: string | null;
	birthDate?: string | null;
	info?: UpdateProfileInfo;
};
