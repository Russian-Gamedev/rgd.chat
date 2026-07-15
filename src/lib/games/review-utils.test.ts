import {
	compareRevisions,
	isPositiveDiscordId,
	parseReviewFilters,
	reviewWaitingClass,
	validReviewComment
} from './review-utils';
import { describe, expect, test } from 'bun:test';

describe('game review helpers', () => {
	test('defaults queue to review and resets invalid offset', () => {
		expect(parseReviewFilters(new URLSearchParams('offset=-5'))).toMatchObject({
			status: 'review',
			offset: 0
		});
		expect(
			parseReviewFilters(new URLSearchParams('status=published&offset=20&owner_id=123'))
		).toMatchObject({ status: 'published', offset: 20, ownerId: '123' });
	});

	test('validates Discord ids and review comments', () => {
		expect(isPositiveDiscordId('123456789')).toBeTrue();
		expect(isPositiveDiscordId('0')).toBeFalse();
		expect(isPositiveDiscordId('123.5')).toBeFalse();
		expect(validReviewComment('  comment  ')).toBeTrue();
		expect(validReviewComment('   ')).toBeFalse();
		expect(validReviewComment('x'.repeat(2001))).toBeFalse();
	});

	test('classifies review waiting time', () => {
		expect(reviewWaitingClass(new Date().toISOString())).toBe('neutral');
		expect(reviewWaitingClass(new Date(Date.now() - 25 * 3_600_000).toISOString())).toBe('warning');
		expect(reviewWaitingClass(new Date(Date.now() - 73 * 3_600_000).toISOString())).toBe(
			'critical'
		);
	});

	test('compares stable revision content keys', () => {
		const base = {
			id: 'g',
			title: 'New',
			description: 'D',
			tags: [{ slug: 'tag', name: 'Tag' }],
			credits: { owner_id: 'owner', authors: [{ type: 'discord' as const, discord_user_id: '123' }] },
			resources: {
				links: [{ icon: 'IconGlobe', label: 'Site', link: 'https://example.com' }],
				attachments: [{ type: 'image' as const, url: 'https://example.com/a.png' }]
			},
			metadata: { release_date: '2026-01-01', published_at: '', updated_at: '' }
		};
		const published = {
			id: 'g',
			slug: 'old',
			title: 'Old',
			description: 'D',
			thumbnail: null,
			tags: [{ slug: 'tag', name: 'Tag' }],
			credits: base.credits,
			resources: base.resources,
			metadata: {
				release_date: '2026-01-01',
				published_at: '2026-01-02',
				updated_at: '2026-01-03'
			},
			stats: { likes_count: 0 }
		};
		const rows = compareRevisions(base, published);
		expect(rows.find((row) => row.field === 'Название')?.changed).toBeTrue();
		expect(rows.find((row) => row.field === 'Теги')?.changed).toBeFalse();
	});
});
