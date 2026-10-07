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
		<li>
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
				<span class="bullet">{index < current && !errorSteps.includes(index) ? '✓' : index + 1}</span>
				<span class="label">{step.label}</span>
			</button>
			{#if index < steps.length - 1}<span class="line" class:filled={index < current}></span>{/if}
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
		align-items: flex-start;
		display: flex;
		flex: 1;
	}

	li:last-child {
		flex: 0;
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
		width: 2rem;
	}

	button.active .bullet {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-text);
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
		max-width: 7.5rem;
	}

	.line {
		background: #3a3c43;
		flex: 1;
		height: 1px;
		margin-top: 1rem;
	}

	.line.filled {
		background: var(--color-primary);
	}

	@media (max-width: 800px) {
		.label {
			display: none;
		}

		.line {
			margin-top: 1rem;
		}
	}
</style>
