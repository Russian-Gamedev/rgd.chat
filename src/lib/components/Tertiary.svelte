<script lang="ts">
export let label: string;
export let id: string = '';
export let title: string | undefined = undefined;
</script>

<span class="tertiary" {id} {title}>{label}</span>

<style>
	.tertiary {
		display: block;
		position: relative;

		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		padding-left: 1rem;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			margin-left: -0.95rem;
			width: 0.25rem;
			border-radius: 0.75rem;
			background-color: var(--color-primary);
		}
	}
</style>
