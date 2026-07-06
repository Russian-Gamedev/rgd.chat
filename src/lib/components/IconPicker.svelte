<script lang="ts">
import type { Component } from 'svelte';

import * as icons from '$lib/assets/icons';
import Button from '$lib/components/Button.svelte';
import { Popout, type PopoutApi } from '$lib/components/popout';

type IconPickerProps = {
	value?: string;
	label?: string;
	onSelect?: (value: string) => void;
};

const DEFAULT_ICON_KEY = 'IconGlobe';
const iconEntries = Object.entries(icons).sort(([a], [b]) => a.localeCompare(b)) as Array<
	[string, Component]
>;
const iconComponents = Object.fromEntries(iconEntries) as Record<string, Component>;

let { value = $bindable(DEFAULT_ICON_KEY), label = 'Icon', onSelect }: IconPickerProps = $props();

let popout: PopoutApi | undefined = $state();

const selectedKey = $derived(getIconKey(value));
const SelectedIcon = $derived(iconComponents[selectedKey]);
const selectedLabel = $derived(normalizeIconName(selectedKey));

function getIconKey(iconKey: string | null | undefined) {
	return iconKey && iconKey in icons ? iconKey : DEFAULT_ICON_KEY;
}

function normalizeIconName(iconKey: string) {
	return iconKey.replace(/^Icon/, '').toLowerCase();
}

function selectIcon(iconKey: string) {
	value = iconKey;
	onSelect?.(iconKey);
	popout?.close();
}
</script>

<div class="icon-picker-field">
	{#if label}
		<span class="icon-picker-label">{label}</span>
	{/if}
	<Popout bind:api={popout} mode="click" placement="bottom-start" role="dialog" interactive>
		{#snippet trigger()}
			<Button
				type="button"
				variant="outline"
				class="icon-picker-button"
				aria-label={`Выбрать иконку, сейчас ${selectedLabel}`}
				title={selectedKey}
			>
				<span class="selected-icon" aria-hidden="true"><SelectedIcon /></span>
				<span class="sr-only">{selectedLabel}</span>
			</Button>
		{/snippet}

		{#snippet content()}
			<div class="icon-picker-popout" aria-label="Иконки">
				{#each iconEntries as [iconKey, Icon] (iconKey)}
					<button
						class="icon-option"
						class:selected={iconKey === selectedKey}
						type="button"
						aria-label={normalizeIconName(iconKey)}
						aria-pressed={iconKey === selectedKey}
						onclick={() => selectIcon(iconKey)}
					>
						<span class="icon-option-preview" aria-hidden="true"><Icon /></span>
						<span>{normalizeIconName(iconKey)}</span>
					</button>
				{/each}
			</div>
		{/snippet}
	</Popout>
</div>

<style>
	.icon-picker-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.icon-picker-label {
		color: var(--color-text-secondary);
		font-size: 12px;
		font-weight: 500;
		line-height: 1;
	}

	.icon-picker-field :global(.popout-trigger),
	.icon-picker-field :global(.icon-picker-button) {
		width: 100%;
	}

	.icon-picker-field :global(.icon-picker-button) {
		min-height: 48px;
		justify-content: center;
		padding: 10px 12px;
		border-color: #212226;
		background: var(--color-bg-surface);
	}

	.selected-icon,
	.icon-option-preview {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
	}

	.selected-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.icon-picker-popout {
		display: grid;
		grid-template-columns: repeat(5, minmax(56px, 1fr));
		gap: 6px;
		width: min(340px, calc(100vw - 48px));
	}

	.icon-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		min-width: 0;
		min-height: 64px;
		padding: 8px 4px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--color-text-secondary);
		font: inherit;
		font-size: 11px;
		line-height: 1.1;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	.icon-option:hover,
	.icon-option:focus-visible,
	.icon-option.selected {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-bg-surface) 82%, var(--color-primary) 18%);
		color: var(--color-text);
		outline: none;
	}

	.icon-option-preview :global(svg) {
		width: 22px;
		height: 22px;
	}

	.icon-option span:last-child {
		max-width: 100%;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
