<script lang="ts" generics="Element extends keyof SvelteHTMLElements">
	import type { Colors } from '$lib';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type ButtonProps = {
		color?: Colors;
		variant?: 'solid' | 'outline' | 'ghost';
		as?: Element;
	};

	let {
		color = 'primary',
		variant = 'solid',
		as = 'button' as Element,
		children,
		...rest
	}: ButtonProps & SvelteHTMLElements[Element] = $props();

	const classes = ['button', variant, rest.class].filter(Boolean).join(' ');
</script>

<svelte:element this={as} {...rest} class={classes} style={'--color: var(--color-' + color + ')'}>
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

		&:active {
			filter: brightness(0.95);
			scale: 0.98;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		&.solid {
			color: var(--text-primary);
			background-color: var(--color);

			&:hover {
				filter: brightness(1.1);
			}
		}

		&.outline {
			background-color: transparent;
			border: 2px solid var(--color);
			color: var(--color);

			&:hover {
				background-color: var(--color);
				color: var(--text-primary);
			}
		}

		&.ghost {
			background-color: transparent;
			color: var(--color);

			&:hover {
				background-color: var(--color);
				color: var(--text-primary);
			}
		}
	}
</style>
