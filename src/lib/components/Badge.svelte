<script lang="ts">
	export let label: string;
	export let count: number | undefined;

	label += count !== undefined ? ':' : '';
</script>

<span class="badge">
	{label}
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
