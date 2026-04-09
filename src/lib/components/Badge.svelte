<script lang="ts">
	interface BadgeProps {
		label: string;
		count?: number;
	}

	let { label, count }: BadgeProps = $props();
</script>

<span class="badge">
	{label}{count !== undefined ? ':' : ''}
	{#if count !== undefined}
		<span class="count">{count}</span>
	{/if}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		background-color: var(--color-bg-surface);
		color: var(--color-text);
		border-radius: 100px;
		padding: 0.125rem 0.5rem;
		font-size: 14px;
		font-weight: 500;
		text-transform: uppercase;
		gap: 0.25rem;
	}

	.count {
		color: var(--color-primary);
	}
</style>
