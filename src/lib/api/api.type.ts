export interface MembersStats {
	online: number;
	total: number;
}

export type WalletBalance = {
	balance: string;
};

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
		id?: string;
		username: string;
		avatar_url: string;
		banner: string;
	};
};

export type Donation = {
	username: string;
	avatar_url: string;
	message: string;
	amount: number;
	is_fee_paid_by_user: boolean;
	date: string;
	image: string;
};

export type DonationsPage = {
	items: Donation[];
	page: number;
	per_page: number;
	total: number;
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
	activityPublic: boolean;
	permissions: Permissions;
	tags: UserTag[];
};

export type MotdListItem = {
	content: string;
	id: number;
	user: {
		id: string;
		username: string;
		avatar_url: string;
	};
};

export type AddMotdResponse = {
	id: number;
	content: string;
	balance_after: string;
};

export type GuildEventName =
	| 'member_first_join'
	| 'member_join'
	| 'member_leave'
	| 'member_ban'
	| 'member_kick'
	| 'member_set_name'
	| 'activity_raffle';

export type GuildEventAuthor = {
	id: string;
	username: string;
	avatar_url: string;
};

export type GuildEventListItem = {
	id: string;
	event: GuildEventName;
	message: string;
	attachments: string[] | null;
	author: GuildEventAuthor;
};

export type AddEventResponse = {
	id: string;
	event: GuildEventName;
	message: string;
	balance_after: string;
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
	activityPublic?: boolean;
};

export type ActivityDay = {
	date: string;
	messageScore: number;
	voiceSeconds: number;
	reactionCount: number;
};

export type ActivityTotals = {
	messageScore: number;
	voiceSeconds: number;
	reactionCount: number;
};

export type ActivityStreak = {
	current: number;
	max: number;
};

export type UserActivity = {
	days: ActivityDay[];
	totals: ActivityTotals;
	streak: ActivityStreak;
};

export type CurrentUserActivity = UserActivity & {
	isPublic: boolean;
};

export type ActivityOverviewDay = ActivityDay & {
	activeUsers: number;
};

export type ActivityOverview = {
	days: ActivityOverviewDay[];
	totals: ActivityTotals;
	activeWeekUsers: number;
};
