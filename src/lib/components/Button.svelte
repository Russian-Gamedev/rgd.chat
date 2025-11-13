<script lang="ts" generics="Element extends keyof SvelteHTMLElements">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type ButtonProps = {
		variant?: 'primary' | 'secondary';
		as?: Element;
	};

	let {
		variant = 'primary',
		as,
		children,
		...rest
	}: ButtonProps & SvelteHTMLElements[Element] = $props();

	const classes = ['button', variant, rest.class].filter(Boolean).join(' ');
</script>

<svelte:element this={as} {...rest} class={classes}>
	{@render children?.()}
</svelte:element>

<style>
	:global(.button) {
		font-weight: 700;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 0.75rem;
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: center;
		width: fit-content;
		color: var(--text-primary);
		text-decoration: none;
		transition: all 300ms ease-in;
		cursor: pointer;

		&:hover {
			filter: brightness(1.05);
		}

		&:active {
			filter: brightness(0.95);
			scale: 0.98;
		}
	}

	.primary {
		background-color: var(--color-primary);
	}
</style>
