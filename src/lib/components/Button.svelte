<script lang="ts" generics="Element extends keyof SvelteHTMLElements">
import type { SvelteHTMLElements } from 'svelte/elements';

import type { Colors } from '$lib';

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

const classes = $derived(['button', variant, rest.class].filter(Boolean).join(' '));
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
		color: var(--color-text);
		text-decoration: none;
		transition:
			background-color 200ms ease,
			border-color 200ms ease,
			color 200ms ease,
			filter 200ms ease,
			opacity 200ms ease,
			transform 200ms ease;
		cursor: pointer;

		&:active {
			filter: brightness(0.95);
			transform: scale(0.98);
		}

		&:focus-visible {
			outline: 2px solid var(--color);
			outline-offset: 3px;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		&.solid {
			color: var(--color-text);
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
				color: var(--color-text);
			}
		}

		&.ghost {
			background-color: transparent;
			color: var(--color);

			&:hover {
				background-color: var(--color);
				color: var(--color-text);
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.button) {
			transition: none;

			&:active {
				transform: none;
			}
		}
	}
</style>
