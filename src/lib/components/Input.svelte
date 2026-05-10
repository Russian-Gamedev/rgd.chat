<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type InputProps = HTMLInputAttributes & {
		label?: string;
	};

	let fallbackId = $props.id();

	let {
		type = '',
		value = $bindable(''),
		label = '',
		id = fallbackId,
		...rest
	}: InputProps = $props();

	let isFocused = $state(false);
	const hasValue = $derived(value && value.length > 0);
	const isFloating = $derived(isFocused || hasValue);
</script>

<div class="input-wrapper">
	<input
		{id}
		{type}
		{...rest}
		bind:value
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
		class:no-label={!label}
	/>
	{#if label}
		<label for={id} class:floating={isFloating}>
			{label}
		</label>
	{/if}
</div>

<style>
	.input-wrapper {
		position: relative;
		width: 100%;
	}

	input {
		width: 100%;
		border-radius: 8px;
		padding: 24px 16px 8px 16px;
		border: 1px solid #212226;
		background: var(--color-bg-surface);
		font-size: 1rem;
		color: var(--color-text);
		transition: border-color 0.2s ease;
	}

	input.no-label {
		padding: 12px 16px;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	label {
		position: absolute;
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1rem;
		color: var(--color-text-secondary);
		font-weight: 400;
		pointer-events: none;
		transition:
			top 0.2s ease,
			transform 0.2s ease,
			font-size 0.2s ease,
			color 0.2s ease;
		background: transparent;
	}

	label.floating {
		top: 8px;
		transform: translateY(0);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-primary);
	}
</style>
