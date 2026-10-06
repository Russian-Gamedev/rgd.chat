<script lang="ts">
import { createApi } from '$lib/api/api';
import type { User, UserActivity } from '$lib/api/api.type';
import ActivityGraph from '$lib/components/ActivityGraph.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import Tertiary from '$lib/components/Tertiary.svelte';
import { formatNumber, formatVoiceDuration } from '$lib/utils/format';

import { updateProfile } from './EditProfileModal.api';

type ProfileActivityProps = {
	user: User;
	currentUser: User | null;
	initialActivity: UserActivity | null;
};

const PERIOD_OPTIONS = [3, 6, 12];
const DEFAULT_PERIOD_MONTHS = 12;

let { user, currentUser, initialActivity }: ProfileActivityProps = $props();

let savedActivity = $state<UserActivity | null>(null);
let selectedMonths = $state(DEFAULT_PERIOD_MONTHS);
let isLoading = $state(false);
let isToggling = $state(false);
let isPublicOverride = $state<boolean | null>(null);

const isOwnProfile = $derived(currentUser?.id === user.id);
const activity = $derived(savedActivity ?? initialActivity);
const isPublic = $derived(isPublicOverride ?? activity?.isPublic ?? user.activityPublic);
const showGraph = $derived(isOwnProfile || isPublic);

async function selectPeriod(months: number) {
	if (months === selectedMonths || isLoading) {
		return;
	}

	const previousMonths = selectedMonths;
	selectedMonths = months;
	isLoading = true;

	try {
		const api = createApi({ fetch });
		savedActivity = isOwnProfile
			? await api.getMyActivity(months)
			: await api.getUserActivity(user.id, months);
	} catch {
		selectedMonths = previousMonths;
		showSnackbar({
			message: 'Не удалось загрузить активность.',
			variant: 'error'
		});
	} finally {
		isLoading = false;
	}
}

async function toggleVisibility() {
	if (isToggling) {
		return;
	}

	isToggling = true;

	try {
		const updated = await updateProfile({ activityPublic: !isPublic });
		isPublicOverride = updated.activityPublic;
		showSnackbar({
			message: isPublic ? 'График активности виден другим.' : 'График активности скрыт.',
			variant: 'success'
		});
	} catch {
		showSnackbar({
			message: 'Не удалось изменить настройку.',
			variant: 'error'
		});
	} finally {
		isToggling = false;
	}
}
</script>

{#if activity}
	<section class="activity">
		<div class="header">
			<Tertiary label="Активность" />
			{#if isOwnProfile}
				<label class="visibility">
					<span>График виден другим</span>
					<button
						type="button"
						class="switch"
						class:on={isPublic}
						role="switch"
						aria-checked={isPublic}
						aria-label="Показывать график активности другим"
						onclick={toggleVisibility}
						disabled={isToggling}
					>
						<span class="knob"></span>
					</button>
				</label>
			{/if}
		</div>

		<div class="stats">
			<div class="stat">
				<span class="value">{formatNumber(activity.totals.messageScore)}</span>
				<span class="label">сообщений</span>
			</div>
			<div class="stat">
				<span class="value">{formatVoiceDuration(activity.totals.voiceSeconds)}</span>
				<span class="label">в голосовых каналах</span>
			</div>
			<div class="stat">
				<span class="value">{formatNumber(activity.totals.reactionCount)}</span>
				<span class="label">реакций</span>
			</div>
			<div class="stat">
				<span class="value">{activity.streak.current} дн.</span>
				<span class="label">серия активности (рекорд: {activity.streak.max})</span>
			</div>
		</div>

		{#if showGraph && activity.days}
			<div class="periods">
				{#each PERIOD_OPTIONS as option (option)}
					<button
						type="button"
						class="period"
						class:active={selectedMonths === option}
						onclick={() => selectPeriod(option)}
						disabled={isLoading}
					>
						{option} мес.
					</button>
				{/each}
			</div>

			<ActivityGraph days={activity.days} />
		{/if}
	</section>
{/if}

<style>
	.activity {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.visibility {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		color: var(--color-text-secondary);
		cursor: pointer;
		user-select: none;
	}

	.switch {
		position: relative;
		width: 40px;
		height: 22px;
		border: none;
		border-radius: 999px;
		background-color: color-mix(in srgb, var(--color-text) 15%, var(--color-bg-surface));
		cursor: pointer;
		transition: background-color 150ms;
		padding: 0;
	}

	.switch.on {
		background-color: var(--color-primary);
	}

	.switch:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.knob {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: var(--color-text);
		transition: transform 150ms;
	}

	.switch.on .knob {
		transform: translateX(18px);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 12px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 16px;
		background-color: var(--color-bg-surface);
		border-radius: 8px;
	}

	.value {
		font-size: 20px;
		font-weight: 700;
	}

	.label {
		font-size: 13px;
		color: var(--color-text-secondary);
	}

	.periods {
		display: flex;
		gap: 8px;
	}

	.period {
		padding: 6px 14px;
		border: 1px solid color-mix(in srgb, var(--color-text) 15%, transparent);
		border-radius: 999px;
		background: transparent;
		color: var(--color-text-secondary);
		font: inherit;
		font-size: 13px;
		cursor: pointer;
		transition:
			color 150ms,
			border-color 150ms,
			background-color 150ms;
	}

	.period:hover {
		color: var(--color-text);
	}

	.period.active {
		border-color: var(--color-primary);
		background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
		color: var(--color-text);
	}

	.period:disabled {
		opacity: 0.6;
		cursor: default;
	}
</style>
