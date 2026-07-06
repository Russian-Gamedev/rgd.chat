<script lang="ts">
import type { SnackbarItem } from './snackbar.store.svelte';

type SnackbarItemProps = {
	item: SnackbarItem;
	onDismiss: (id: string) => void;
};

let { item, onDismiss }: SnackbarItemProps = $props();

const role = $derived(item.variant === 'error' ? 'alert' : 'status');
</script>

<article class={['snackbar-item', item.variant]} {role}>
	<div class="snackbar-content">
		<p>{item.message}</p>
	</div>
	<button
		type="button"
		class="snackbar-dismiss"
		aria-label="Закрыть уведомление"
		onclick={() => onDismiss(item.id)}
	>
		×
	</button>
</article>

<style>
	.snackbar-item {
		--snackbar-color: var(--color-primary);

		display: flex;
		align-items: flex-start;
		gap: 12px;
		width: min(420px, calc(100vw - 48px));
		padding: 14px 14px 14px 16px;
		border: 1px solid color-mix(in srgb, var(--snackbar-color) 44%, transparent);
		border-left: 4px solid var(--snackbar-color);
		border-radius: 8px;
		background: color-mix(in srgb, var(--color-bg-surface) 94%, var(--snackbar-color) 6%);
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
		color: var(--color-text);
	}

	.snackbar-item.success {
		--snackbar-color: var(--color-success);
	}

	.snackbar-item.error {
		--snackbar-color: var(--color-error);
	}

	.snackbar-item.warning {
		--snackbar-color: var(--color-warning);
	}

	.snackbar-content {
		min-width: 0;
		flex: 1;
	}

	p {
		margin: 0;
		color: var(--color-text);
		font-size: 15px;
		font-weight: 600;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.snackbar-dismiss {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		width: 28px;
		height: 28px;
		border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
		border-radius: 8px;
		background: color-mix(in srgb, var(--color-bg) 86%, var(--snackbar-color) 14%);
		color: var(--color-text-secondary);
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
		transition:
			border-color 160ms ease,
			color 160ms ease,
			background-color 160ms ease;
	}

	.snackbar-dismiss:hover,
	.snackbar-dismiss:focus-visible {
		border-color: color-mix(in srgb, var(--snackbar-color) 70%, transparent);
		color: var(--color-text);
		outline: none;
	}

	@media (max-width: 767px) {
		.snackbar-item {
			width: calc(100vw - 24px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.snackbar-dismiss {
			transition: none;
		}
	}
</style>
