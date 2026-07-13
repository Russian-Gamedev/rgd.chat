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
			release_date: '2026-01-01',
			tags: [{ id: 'tag', slug: 'tag', name: 'Tag' }],
			authors: [{ type: 'discord' as const, discord_user_id: '123' }],
			links: [{ icon: 'IconGlobe', label: 'Site', link: 'https://example.com' }],
			attachments: [{ type: 'image' as const, url: 'https://example.com/a.png' }]
		};
		const published = {
			...base,
			title: 'Old',
			tags: [{ id: 'tag', slug: 'tag', name: 'Tag' }],
			description: 'D'
		} as never;
		const rows = compareRevisions(base, published);
		expect(rows.find((row) => row.field === 'Название')?.changed).toBeTrue();
		expect(rows.find((row) => row.field === 'Теги')?.changed).toBeFalse();
	});
});
