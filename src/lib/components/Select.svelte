<script lang="ts">
import type { Snippet } from 'svelte';

import { IconChevronDown } from '$lib/assets/icons';
import Button from '$lib/components/Button.svelte';
import { Popout, type PopoutApi } from '$lib/components/popout';

export type SelectOption = {
	value: string;
	label: string;
	meta?: unknown;
};

type SelectProps = {
	options: SelectOption[];
	values?: string[];
	multiple?: boolean;
	placeholder?: string;
	option?: Snippet<[SelectOption]>;
};

let {
	options,
	values = $bindable([]),
	multiple = false,
	placeholder = 'Выберите…',
	option
}: SelectProps = $props();

let popout: PopoutApi | undefined = $state();
let isOpen = $state(false);

const selectedOptions = $derived(options.filter((item) => values.includes(item.value)));

function isSelected(item: SelectOption) {
	return values.includes(item.value);
}

function toggle(item: SelectOption) {
	if (multiple) {
		values = isSelected(item)
			? values.filter((value) => value !== item.value)
			: [...values, item.value];
		return;
	}

	values = isSelected(item) ? [] : [item.value];
	popout?.close();
}
</script>

{#snippet renderOption(item: SelectOption)}
	{#if option}
		{@render option(item)}
	{:else}
		{item.label}
	{/if}
{/snippet}

<div class="select">
	<Popout
		bind:api={popout}
		mode="click"
		placement="bottom-start"
		role="dialog"
		interactive
		onOpenChange={(open) => (isOpen = open)}
	>
		{#snippet trigger()}
			<Button type="button" variant="outline" class="select-trigger">
				<span class="select-value">
					{#if selectedOptions.length === 0}
						<span class="select-placeholder">{placeholder}</span>
					{:else if selectedOptions.length === 1}
						{@render renderOption(selectedOptions[0])}
					{:else}
						Выбрано: {selectedOptions.length}
					{/if}
				</span>
				<span class="select-chevron" class:open={isOpen} aria-hidden="true"
					><IconChevronDown /></span
				>
			</Button>
		{/snippet}

		{#snippet content()}
			<div class="select-menu">
				{#each options as item (item.value)}
					<button
						type="button"
						class="select-option"
						class:selected={isSelected(item)}
						aria-pressed={isSelected(item)}
						onclick={() => toggle(item)}
					>
						{@render renderOption(item)}
					</button>
				{/each}
			</div>
		{/snippet}
	</Popout>
</div>

<style>
	.select :global(.select-trigger) {
		justify-content: space-between;
		gap: 8px;
		min-width: 180px;
		max-width: 260px;
		padding: 8px 12px;
		border: 1px solid #212226;
		border-radius: 8px;
		background: var(--color-bg-surface);
		color: var(--color-text);
		font-weight: 500;
	}

	.select :global(.select-trigger:hover) {
		border-color: color-mix(in srgb, #212226 55%, var(--color-primary) 45%);
		background: var(--color-bg-surface);
		color: var(--color-text);
	}

	.select-value {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
	}

	.select-placeholder {
		color: var(--color-text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.select-chevron {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		color: var(--color-text-secondary);
		transition: transform 160ms ease;
	}

	.select-chevron.open {
		transform: rotate(180deg);
	}

	.select-chevron :global(svg) {
		width: 14px;
		height: 14px;
	}

	.select-menu {
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-height: 280px;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.select-option {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--color-text-secondary);
		font: inherit;
		font-size: 14px;
		line-height: 1.35;
		text-align: left;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	.select-option:hover,
	.select-option:focus-visible,
	.select-option.selected {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-bg-surface) 82%, var(--color-primary) 18%);
		color: var(--color-text);
		outline: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.select-chevron {
			transition: none;
		}

		.select-option {
			transition: none;
		}
	}
</style>
