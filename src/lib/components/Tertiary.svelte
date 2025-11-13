<script lang="ts">
	export let label: string;
</script>

<span class="tertiary">{label}</span>

<style>
	.tertiary {
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		padding-left: 1rem;
		margin-bottom: 1.5rem;
		margin-top: 3rem;

		&::before {
			content: '';
			position: absolute;
			margin-left: -0.95rem;
			height: 1.75rem;
			width: 0.25rem;
			border-radius: 0.75rem;
			background-color: var(--color-primary);
		}
	}
</style>
