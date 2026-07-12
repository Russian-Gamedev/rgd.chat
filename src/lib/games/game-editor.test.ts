import type { GameEditorDto } from '../api/api.type';
import {
	canDeleteUnpublished,
	editorToForm,
	emptyGameForm,
	formSnapshot,
	formToPayload,
	isAbsoluteHttpsUrl,
	isEditorReadonly,
	moveItem,
	validateGameForm,
	youtubeEmbedUrl
} from './game-editor';
import { describe, expect, test } from 'bun:test';

const editor: GameEditorDto = {
	id: 'game-1',
	owner_id: 'owner-1',
	title: 'Игра',
	description: 'Описание',
	release_date: '2026-07-12',
	genres: [{ id: 'genre-1', slug: 'action', name: 'Экшен' }],
	authors: [
		{ type: 'discord', discord_user_id: '123456789012345678' },
		{ type: 'text', name: 'Команда' }
	],
	image: null,
	likes_count: 0,
	published_at: '',
	links: [{ icon: 'IconGlobe', label: 'Сайт', link: 'https://example.com' }],
	attachments: [{ type: 'image', url: 'https://example.com/image.png' }],
	updated_at: '2026-07-12T00:00:00Z',
	status: 'draft',
	version: 3,
	has_published_version: true,
	published_version: 2,
	review_events: []
};

describe('game editor normalization', () => {
	test('loads an existing draft into form state', () => {
		expect(editorToForm(editor)).toEqual({
			title: 'Игра',
			description: 'Описание',
			releaseDate: '2026-07-12',
			genreIds: ['genre-1'],
			authors: editor.authors,
			links: editor.links,
			attachments: editor.attachments
		});
	});

	test('preserves both author union variants and snowflake as a string', () => {
		const payload = formToPayload(editorToForm(editor));
		expect(payload.authors).toEqual(editor.authors);
		const author = payload.authors[0];
		expect(author.type).toBe('discord');
		expect(author.type === 'discord' ? typeof author.discord_user_id : 'wrong variant').toBe(
			'string'
		);
	});

	test('fully replaces and clears array payloads', () => {
		const form = editorToForm(editor);
		form.genreIds = [];
		form.authors = [];
		form.links = [];
		form.attachments = [];
		expect(formToPayload(form)).toMatchObject({
			genre_ids: [],
			authors: [],
			links: [],
			attachments: []
		});
	});

	test('takes version and status only from the editor DTO', () => {
		const next = { ...editor, version: 4, status: 'review' as const };
		expect(next.version).toBe(4);
		expect(editorToForm(next)).toEqual(editorToForm(editor));
	});

	test('detects order changes in dirty snapshots', () => {
		const form = editorToForm(editor);
		const original = formSnapshot(form);
		form.authors = [...form.authors].reverse();
		expect(formSnapshot(form)).not.toBe(original);
	});

	test('moves ordered items without mutating input', () => {
		const source = ['a', 'b', 'c'];
		expect(moveItem(source, 1, -1)).toEqual(['b', 'a', 'c']);
		expect(source).toEqual(['a', 'b', 'c']);
	});
});

describe('game editor validation', () => {
	test('accepts a calendar date without timezone conversion', () => {
		const errors = validateGameForm(editorToForm(editor), true);
		expect(errors.releaseDate).toBeUndefined();
		expect(formToPayload(editorToForm(editor)).release_date).toBe('2026-07-12');
	});

	test('rejects an impossible calendar date', () => {
		const form = editorToForm(editor);
		form.releaseDate = '2026-02-31';
		expect(validateGameForm(form).releaseDate).toBeDefined();
	});

	test('requires at least one genre for review', () => {
		const form = editorToForm(editor);
		form.genreIds = [];
		expect(validateGameForm(form, false).genreIds).toBeUndefined();
		expect(validateGameForm(form, true).genreIds).toBeDefined();
	});

	test('enforces collection limits', () => {
		const form = editorToForm(editor);
		form.genreIds = Array.from({ length: 11 }, (_, index) => String(index));
		form.authors = Array.from({ length: 21 }, () => ({ type: 'text' as const, name: 'A' }));
		form.links = Array.from({ length: 6 }, () => ({
			icon: 'x',
			label: 'X',
			link: 'https://x.dev'
		}));
		form.attachments = Array.from({ length: 21 }, () => ({
			type: 'image' as const,
			url: 'https://x.dev/a.png'
		}));
		const errors = validateGameForm(form, true);
		expect(errors.genreIds).toBeDefined();
		expect(errors.authors).toBeDefined();
		expect(errors.links).toBeDefined();
		expect(errors.attachments).toBeDefined();
	});

	test('rejects non-HTTPS links and attachments', () => {
		const form = editorToForm(editor);
		form.links[0].link = 'http://example.com';
		form.attachments[0].url = 'javascript:alert(1)';
		const errors = validateGameForm(form);
		expect(errors.links).toBeDefined();
		expect(errors.attachments).toBeDefined();
		expect(isAbsoluteHttpsUrl('https://example.com')).toBeTrue();
	});

	test('rejects a numeric conversion artifact in Discord ID', () => {
		const form = editorToForm(editor);
		form.authors = [{ type: 'discord', discord_user_id: '123.5' }];
		expect(validateGameForm(form).authors).toBeDefined();
	});

	test('blocks review state and unlocks changes_requested draft', () => {
		expect(isEditorReadonly('review')).toBeTrue();
		expect(isEditorReadonly('draft')).toBeFalse();
	});

	test('allows deletion only when no version was ever published', () => {
		expect(canDeleteUnpublished({ has_published_version: false })).toBeTrue();
		expect(canDeleteUnpublished({ has_published_version: true })).toBeFalse();
	});

	test('uses embeds only for supported YouTube URLs', () => {
		expect(youtubeEmbedUrl('https://youtu.be/abcdefghijk')).toBe(
			'https://www.youtube-nocookie.com/embed/abcdefghijk'
		);
		expect(youtubeEmbedUrl('https://example.com/video')).toBeNull();
	});

	test('empty form fails required fields', () => {
		const errors = validateGameForm(emptyGameForm(), true);
		expect(errors.title).toBeDefined();
		expect(errors.description).toBeDefined();
		expect(errors.releaseDate).toBeDefined();
		expect(errors.genreIds).toBeDefined();
	});
});
