<script lang="ts">
let {
	steps,
	current,
	maxReached,
	errorSteps = [],
	onSelect
}: {
	steps: readonly { label: string }[];
	current: number;
	maxReached: number;
	errorSteps?: readonly number[];
	onSelect: (index: number) => void;
} = $props();
</script>

<ol class="stepper">
	{#each steps as step, index (`${index}-${step.label}`)}
		<li class:filled={index < current}>
			<button
				type="button"
				class:done={index < maxReached || index < current}
				class:active={index === current}
				class:error={errorSteps.includes(index)}
				class:clickable={index <= maxReached && index !== current}
				disabled={index > maxReached}
				aria-current={index === current ? 'step' : undefined}
				onclick={() => onSelect(index)}
			>
				<span class="bullet">{index + 1}</span>
				<span class="label">{step.label}</span>
			</button>
		</li>
	{/each}
</ol>

<style>
	.stepper {
		display: flex;
		list-style: none;
		margin: 0 0 2rem;
		padding: 0;
	}

	li {
		flex: 1;
		/* Линия между кружками: от края текущего круга до края следующего. */
		position: relative;
	}

	li:not(:last-child)::after {
		content: '';
		background: #3a3c43;
		height: 1px;
		left: calc(50% + 1.25rem);
		position: absolute;
		right: calc(-50% + 1.25rem);
		top: 1rem;
	}

	li.filled:not(:last-child)::after {
		background: var(--color-primary);
	}

	button {
		background: transparent;
		border: 0;
		color: var(--color-text-secondary);
		cursor: default;
		display: flex;
		flex-direction: column;
		font: inherit;
		gap: 0.45rem;
		padding: 0;
		text-align: center;
		width: 100%;
	}

	button.clickable {
		cursor: pointer;
	}

	button.clickable:hover .label {
		color: var(--color-text);
	}

	.bullet {
		align-items: center;
		background: var(--color-bg-surface);
		border: 1px solid #3a3c43;
		border-radius: 999px;
		color: var(--color-text-secondary);
		display: inline-flex;
		font-size: 0.875rem;
		font-weight: 700;
		height: 2rem;
		justify-content: center;
		margin: 0 auto;
		position: relative;
		width: 2rem;
	}

	button.active .bullet {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #fff;
	}

	button.done .bullet {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	button.error .bullet {
		background: var(--color-error);
		border-color: var(--color-error);
		color: var(--color-text);
	}

	button.active .label {
		color: var(--color-text);
		font-weight: 700;
	}

	.label {
		display: block;
		font-size: 0.8125rem;
		margin: 0 auto;
		max-width: 7.5rem;
	}

	@media (max-width: 800px) {
		.label {
			display: none;
		}
	}
</style>
