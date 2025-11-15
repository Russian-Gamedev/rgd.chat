<script lang="ts">
	export let label: string;
	export let id: string = '';
</script>

<span class="tertiary" {id}>{label}</span>

<style>
	.tertiary {
		display: block;

		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		padding-left: 1rem;

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
