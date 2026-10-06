import type { ProjectEditor } from '../api/api.type';
import {
	canDeleteUnpublished,
	editorToForm,
	emptyProjectForm,
	formSnapshot,
	formToPayload,
	formToUpdatePayload,
	isAbsoluteHttpsUrl,
	isEditorReadonly,
	isValidProjectSlug,
	moveItem,
	normalizeProjectSlug,
	slugifyProjectTitle,
	validateProjectForm,
	youtubeEmbedUrl
} from './project-editor';
import { describe, expect, test } from 'bun:test';

const editor: ProjectEditor = {
	id: 'project-1',
	slug: 'igra',
	title: 'Проект',
	description: 'Описание',
	tags: [{ slug: 'action', name: 'Экшен' }],
	thumbnail: null,
	credits: {
		owner_id: 'owner-1',
		authors: [
			{ type: 'discord', discord_user_id: '123456789012345678' },
			{ type: 'text', name: 'Команда' }
		]
	},
	resources: {
		links: [{ icon: 'IconGlobe', label: 'Сайт', link: 'https://example.com' }],
		attachments: [{ type: 'image', url: 'https://example.com/image.png' }]
	},
	metadata: {
		release_date: '2026-07-12',
		published_at: '',
		updated_at: '2026-07-12T00:00:00Z'
	},
	stats: { likes_count: 0 },
	workflow: {
		status: 'draft',
		version: 3,
		has_published_version: true,
		published_version: 2,
		review_events: []
	}
};

describe('project editor normalization', () => {
	test('loads an existing draft into form state', () => {
		expect(editorToForm(editor)).toEqual({
			title: 'Проект',
			slug: 'igra',
			slugManuallyEdited: true,
			description: 'Описание',
			releaseDate: '2026-07-12',
			tags: [{ name: 'Экшен', slug: 'action' }],
			authors: editor.credits.authors,
			links: editor.resources.links,
			attachments: editor.resources.attachments
		});
	});

	test('preserves both author union variants and snowflake as a string', () => {
		const payload = formToPayload(editorToForm(editor));
		expect(payload.authors).toEqual(editor.credits.authors);
		expect(payload.tags).toEqual(['Экшен']);
		const author = payload.authors[0];
		expect(author.type).toBe('discord');
		expect(author.type === 'discord' ? typeof author.discord_user_id : 'wrong variant').toBe(
			'string'
		);
	});

	test('fully replaces and clears array payloads', () => {
		const form = editorToForm(editor);
		form.tags = [];
		form.authors = [];
		form.links = [];
		form.attachments = [];
		expect(formToPayload(form)).toMatchObject({
			tags: [],
			authors: [],
			links: [],
			attachments: []
		});
	});

	test('takes version and status only from the editor DTO', () => {
		const next = {
			...editor,
			workflow: { ...editor.workflow, version: 4, status: 'review' as const }
		};
		expect(next.workflow.version).toBe(4);
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

describe('project editor validation', () => {
	test('accepts a calendar date without timezone conversion', () => {
		const errors = validateProjectForm(editorToForm(editor), true);
		expect(errors.releaseDate).toBeUndefined();
		expect(formToPayload(editorToForm(editor)).release_date).toBe('2026-07-12');
	});

	test('rejects an impossible calendar date', () => {
		const form = editorToForm(editor);
		form.releaseDate = '2026-02-31';
		expect(validateProjectForm(form).releaseDate).toBeDefined();
	});

	test('requires at least one tag for review', () => {
		const form = editorToForm(editor);
		form.tags = [];
		expect(validateProjectForm(form, false).tags).toBeUndefined();
		expect(validateProjectForm(form, true).tags).toBeDefined();
	});

	test('enforces collection limits', () => {
		const form = editorToForm(editor);
		form.tags = Array.from({ length: 11 }, (_, index) => ({
			name: String(index),
			slug: null
		}));
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
		const errors = validateProjectForm(form, true);
		expect(errors.tags).toBeDefined();
		expect(errors.authors).toBeDefined();
		expect(errors.links).toBeDefined();
		expect(errors.attachments).toBeDefined();
	});

	test('rejects non-HTTPS links and attachments', () => {
		const form = editorToForm(editor);
		form.links[0].link = 'http://example.com';
		form.attachments[0].url = 'javascript:alert(1)';
		const errors = validateProjectForm(form);
		expect(errors.links).toBeDefined();
		expect(errors.attachments).toBeDefined();
		expect(isAbsoluteHttpsUrl('https://example.com')).toBeTrue();
	});

	test('rejects a numeric conversion artifact in Discord ID', () => {
		const form = editorToForm(editor);
		form.authors = [{ type: 'discord', discord_user_id: '123.5' }];
		expect(validateProjectForm(form).authors).toBeDefined();
	});

	test('blocks review state and unlocks changes_requested draft', () => {
		expect(isEditorReadonly('review')).toBeTrue();
		expect(isEditorReadonly('draft')).toBeFalse();
	});

	test('allows deletion only when no version was ever published', () => {
		expect(
			canDeleteUnpublished({ workflow: { has_published_version: false } } as ProjectEditor)
		).toBeTrue();
		expect(
			canDeleteUnpublished({ workflow: { has_published_version: true } } as ProjectEditor)
		).toBeFalse();
	});

	test('uses embeds only for supported YouTube URLs', () => {
		expect(youtubeEmbedUrl('https://youtu.be/abcdefghijk')).toBe(
			'https://www.youtube-nocookie.com/embed/abcdefghijk'
		);
		expect(youtubeEmbedUrl('https://example.com/video')).toBeNull();
	});

	test('requires a photograph and protects unchanged attachments in patch', () => {
		const form = editorToForm(editor);
		form.attachments = [{ type: 'external_video', url: 'https://example.com/video' }];
		expect(validateProjectForm(form).attachments).toBe(
			'Добавьте хотя бы одну изображение проекта.'
		);
		form.attachments = editor.resources.attachments.map((attachment) => ({ ...attachment }));
		expect(formToUpdatePayload(form, editor.resources.attachments).attachments).toBeUndefined();
	});

	test('normalizes title suggestions and validates slug format', () => {
		expect(slugifyProjectTitle('Моя новая игра')).toBe('моя-новая-игра');
		expect(normalizeProjectSlug(' Моя новая игра! ')).toBe('моя-новая-игра');
		expect(isValidProjectSlug('my-project-2')).toBeTrue();
		expect(isValidProjectSlug('My Project')).toBeFalse();
	});

	test('empty form fails required fields', () => {
		const errors = validateProjectForm(emptyProjectForm(), true);
		expect(errors.title).toBeDefined();
		expect(errors.description).toBeDefined();
		expect(errors.releaseDate).toBeDefined();
		expect(errors.tags).toBeDefined();
	});
});
