<script lang="ts">
import type { ActivityDay } from '$lib/api/api.type';
import { formatDateFull, formatVoiceDuration } from '$lib/utils/format';

type ActivityGraphProps = {
	days: ActivityDay[];
};

let { days }: ActivityGraphProps = $props();

/** Fixed grid width: the graph is always a full year, anchored to the current week. */
const TOTAL_WEEKS = 53;

const MONTH_LABELS = [
	'янв',
	'фев',
	'мар',
	'апр',
	'май',
	'июн',
	'июл',
	'авг',
	'сен',
	'окт',
	'ноя',
	'дек'
];

type Cell = {
	key: string;
	level: number;
	title: string | null;
	future: boolean;
};

type Week = {
	cells: Cell[];
	monthLabel: string | null;
};

let weeks = $derived.by(() => {
	const dayByDate = new Map(days.map((day) => [day.date, day]));
	const maxScore = Math.max(
		0,
		...days.map((day) => day.messageScore + day.voiceSeconds / 60 + day.reactionCount)
	);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const gridStart = new Date(today);
	gridStart.setDate(today.getDate() - today.getDay() - (TOTAL_WEEKS - 1) * 7);

	const gridEnd = new Date(today);
	gridEnd.setDate(today.getDate() + (6 - today.getDay()));

	const weeks: Week[] = [];
	let current: Cell[] = [];
	let lastMonth = gridStart.getMonth();

	const pushWeek = (weekEndDate: Date) => {
		const month = weekEndDate.getMonth();
		weeks.push({
			cells: current,
			monthLabel: month !== lastMonth ? MONTH_LABELS[month] : null
		});
		lastMonth = month;
		current = [];
	};

	for (let date = new Date(gridStart); date <= gridEnd; date.setDate(date.getDate() + 1)) {
		const key = toDateKey(date);
		const day = dayByDate.get(key) ?? null;
		const future = date > today;
		const score = day ? day.messageScore + day.voiceSeconds / 60 + day.reactionCount : 0;

		current.push({
			key,
			future,
			level: toLevel(score, maxScore),
			title: day ? toTitle(key, day) : null
		});

		if (current.length === 7) {
			pushWeek(date);
		}
	}

	return weeks;
});

function toDateKey(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function toLevel(score: number, maxScore: number) {
	if (score <= 0 || maxScore <= 0) return 0;

	return Math.min(4, Math.max(1, Math.ceil((score / maxScore) * 4)));
}

function toTitle(key: string, day: ActivityDay) {
	return `${formatDateFull(key)} — сообщений: ${day.messageScore}, в голосе: ${formatVoiceDuration(day.voiceSeconds)}, реакций: ${day.reactionCount}`;
}
</script>

<div class="graph">
	<div class="scroll">
		<div class="inner">
			<div class="months" aria-hidden="true">
				{#each weeks as week, index (index)}
					<span class="month">{week.monthLabel ?? ''}</span>
				{/each}
			</div>
			<div class="body">
				<div class="weekday-labels" aria-hidden="true">
					<span></span>
					<span>пн</span>
					<span></span>
					<span>ср</span>
					<span></span>
					<span>пт</span>
					<span></span>
				</div>
				<div class="grid" role="img" aria-label="График активности за последний год">
					{#each weeks as week, weekIndex (weekIndex)}
						{#each week.cells as cell, dayIndex (dayIndex)}
							<span
								class="cell level-{cell.level}"
								class:placeholder={cell.future}
								title={cell.title ?? undefined}
							></span>
						{/each}
					{/each}
				</div>
			</div>
			<div class="legend">
				<span>Меньше</span>
				{#each [0, 1, 2, 3, 4] as level (level)}
					<span class="cell level-{level}"></span>
				{/each}
				<span>Больше</span>
			</div>
		</div>
	</div>
</div>

<style>
	.graph {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.scroll {
		overflow-x: auto;
		padding-bottom: 4px;
	}

	.inner {
		display: inline-flex;
		flex-direction: column;
		gap: 4px;
	}

	.months {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 14px;
		margin-left: 28px;
	}

	.month {
		font-size: 11px;
		line-height: 14px;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.body {
		display: flex;
		gap: 4px;
	}

	.weekday-labels {
		display: grid;
		grid-template-rows: repeat(7, 11px);
		gap: 3px;
	}

	.weekday-labels span {
		font-size: 10px;
		line-height: 11px;
		color: var(--color-text-secondary);
	}

	.grid {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(7, 11px);
		grid-auto-columns: 11px;
		gap: 3px;
	}

	.cell {
		width: 11px;
		height: 11px;
		border-radius: 3px;
		background-color: color-mix(in srgb, var(--color-text) 7%, var(--color-bg-surface));
	}

	.cell.level-1 {
		background-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-bg-surface));
	}

	.cell.level-2 {
		background-color: color-mix(in srgb, var(--color-primary) 55%, var(--color-bg-surface));
	}

	.cell.level-3 {
		background-color: color-mix(in srgb, var(--color-primary) 80%, var(--color-bg-surface));
	}

	.cell.level-4 {
		background-color: var(--color-primary);
	}

	.cell.placeholder {
		visibility: hidden;
	}

	.legend {
		display: flex;
		align-items: center;
		align-self: flex-end;
		gap: 4px;
		margin-top: 8px;
		font-size: 11px;
		color: var(--color-text-secondary);
	}

	.legend .cell {
		width: 10px;
		height: 10px;
	}
</style>
