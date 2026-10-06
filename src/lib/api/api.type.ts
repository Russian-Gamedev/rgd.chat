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
	| 'send:messages'
	| 'games:review';

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
	isPublic: boolean;
	/** Per-day graph data; null when the user keeps their activity graph private. */
	days: ActivityDay[] | null;
	totals: ActivityTotals;
	streak: ActivityStreak;
};

export type ActivityOverviewDay = ActivityDay & {
	activeUsers: number;
};

export type ActivityOverview = {
	days: ActivityOverviewDay[];
	totals: ActivityTotals;
	activeWeekUsers: number;
};

export type GolderMedia = {
	id: string;
	name: string;
	slug: string;
	tags: string[];
	url: string;
	contentType: string;
	sizeBytes: string;
	status: 'pending' | 'ready';
	uploadedBy: string;
	uploadedByUsername: string | null;
	uploadedByAvatarUrl: string | null;
	createdAt: string;
	updatedAt: string;
};

export type GolderUpload = {
	media: GolderMedia;
	upload: {
		url: string;
		expiresInSeconds: number;
	};
};

export type GolderMediaPage = {
	items: GolderMedia[];
	total: number;
};

export type GolderListParams = {
	tags?: string;
	search?: string;
	limit?: number;
	offset?: number;
};

export type GolderImportResult = {
	items: GolderMedia[];
};

export type GolderSourceInfo = {
	mediaUrl: string | null;
	name: string | null;
	tags: string[];
};

// --- Games Module ---

export type GameRevisionStatus = 'draft' | 'review' | 'published';

export type GameAuthorType = 'discord' | 'text';

export type GameAttachmentType = 'image' | 'external_video';

export type GameReviewAction = 'submitted' | 'published' | 'changes_requested';

export type GameListSort =
	| 'release_date_desc'
	| 'release_date_asc'
	| 'likes_desc'
	| 'published_desc';

export type GameListQueryDto = {
	limit?: number;
	offset?: number;
	tag?: string;
	author_id?: string;
	search?: string;
	release_from?: string;
	release_to?: string;
	sort?: GameListSort;
};

export type GameListResponseDto = {
	items: GameListItemDto[];
	total: number;
	limit: number;
	offset: number;
};

export type GameAuthorDiscord = { type: 'discord'; discord_user_id: string };
export type GameAuthorText = { type: 'text'; name: string };
export type GameAuthor = GameAuthorDiscord | GameAuthorText;

export type GameListItemDto = {
	id: string;
	slug: string;
	title: string;
	release_date: string;
	tags: GamePublicTag[];
	authors: GameAuthor[];
	thumbnail: string | null;
	likes_count: number;
	published_at: string;
};

export type GameListItem = GameListItemDto;

export type GamePublicTag = {
	slug: string;
	name: string;
};

export type GameAttachment = {
	type: GameAttachmentType;
	url: string;
};

export type GameLink = {
	icon: string;
	label: string;
	link: string;
};

export type GameCredits = {
	owner_id: string;
	authors: GameAuthor[];
};

export type GameResources = {
	attachments: GameAttachment[];
	links: GameLink[];
};

export type GameMetadata = {
	release_date: string;
	published_at: string;
	updated_at: string;
};

export type GameStats = {
	likes_count: number;
};

export type GameWorkflow = {
	revision_id?: string;
	status: GameRevisionStatus;
	version: number;
	has_published_version: boolean;
	published_version: number | null;
	review_events: GameReviewEvent[];
	submitted_at?: string | null;
};

export type GameDetails = {
	id: string;
	slug: string;
	title: string;
	description: string;
	thumbnail: string | null;
	tags: GamePublicTag[];
	credits: GameCredits;
	resources: GameResources;
	metadata: GameMetadata;
	stats: GameStats;
};

export type GameEditor = GameDetails & {
	workflow: GameWorkflow;
};

export type GameAuthorInputDto =
	| { type: 'discord'; discord_user_id: string }
	| { type: 'text'; name: string };

export type GameLinkInputDto = { icon: string; label: string; link: string };

export type GameAttachmentInputDto = {
	type: GameAttachmentType;
	url: string;
};

export type CreateGameDto = {
	title: string;
	slug?: string;
	description: string;
	release_date: string;
	tags: string[];
	authors: GameAuthorInputDto[];
	links?: GameLinkInputDto[];
	attachments: GameAttachmentInputDto[];
};

export type UpdateGameDto = Partial<CreateGameDto>;

export type GameReviewEvent = {
	id: string;
	revision_id: string;
	action: GameReviewAction;
	actor_id: string;
	comment: string | null;
	created_at: string;
	version?: number;
};

export type MineGamesQueryDto = {
	limit?: number;
	offset?: number;
	status?: GameRevisionStatus;
};

export type MineGameItem = {
	id: string;
	slug: string;
	owner_id: string;
	revision_id: string;
	title: string;
	status: GameRevisionStatus;
	version: number;
	has_published_version: boolean;
};

export type MineGamesResponseDto = {
	items: MineGameItem[];
	total: number;
	limit: number;
	offset: number;
};

export type GameReviewListQueryDto = MineGamesQueryDto & {
	owner_id?: string;
	search?: string;
};

export type ReviewListItem = {
	id: string;
	slug: string;
	owner_id: string;
	revision_id: string;
	version: number;
	status: GameRevisionStatus;
	title: string;
	submitted_at: string | null;
	published_at: string | null;
	updated_at: string;
};

export type ReviewListResponseDto = {
	items: ReviewListItem[];
	total: number;
	limit: number;
	offset: number;
};

export type ReviewListQueryDto = {
	limit?: number;
	offset?: number;
	status?: GameRevisionStatus;
	owner_id?: string;
	search?: string;
};

export type LikeStateDto = {
	liked: boolean;
	likes_count: number;
};
