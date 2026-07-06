<script lang="ts">
import {
	autoUpdate,
	computePosition,
	offset as offsetMiddleware,
	shift,
	type VirtualElement
} from '@floating-ui/dom';

import { tick } from 'svelte';
import { flip as flipAnimation } from 'svelte/animate';
import type { TransitionConfig } from 'svelte/transition';

import { browser } from '$app/environment';

import SnackbarItem from './SnackbarItem.svelte';
import { dismissSnackbar, snackbars } from './snackbar.store.svelte';

const desktopEdgeOffset = 24;
const mobileEdgeOffset = 12;
const mobileBreakpoint = 767;
const strategy = 'fixed';

let viewportElement: HTMLDivElement | null = $state(null);

function prefersReducedMotion() {
	return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getEdgeOffset() {
	return window.innerWidth <= mobileBreakpoint ? mobileEdgeOffset : desktopEdgeOffset;
}

const viewportReference: VirtualElement = {
	getBoundingClientRect() {
		const edgeOffset = getEdgeOffset();

		return {
			x: window.innerWidth - edgeOffset,
			y: window.innerHeight,
			width: 0,
			height: 0,
			top: window.innerHeight,
			right: window.innerWidth - edgeOffset,
			bottom: window.innerHeight,
			left: window.innerWidth - edgeOffset
		};
	},
	get contextElement() {
		return document.documentElement;
	}
};

async function updatePosition() {
	if (!browser || !viewportElement) {
		return;
	}

	const edgeOffset = getEdgeOffset();
	const nextPosition = await computePosition(viewportReference, viewportElement, {
		placement: 'top-end',
		strategy,
		middleware: [offsetMiddleware(edgeOffset), shift({ padding: edgeOffset })]
	});

	Object.assign(viewportElement.style, {
		left: `${nextPosition.x}px`,
		top: `${nextPosition.y}px`,
		position: strategy
	});
}

function snackbarTransition(_node: Element, { duration = 220 } = {}): TransitionConfig {
	if (prefersReducedMotion()) {
		return { duration: 0 };
	}

	return {
		duration,
		css: (t, u) => `
			opacity: ${t};
			transform: translateX(calc(${u * 100}% + ${u * 24}px));
		`
	};
}

$effect(() => {
	const snackbarCount = snackbars.length;

	if (!browser || !viewportElement || snackbarCount === 0) {
		return;
	}

	const cleanup = autoUpdate(viewportReference, viewportElement, updatePosition);
	tick().then(updatePosition);

	return cleanup;
});
</script>

{#if snackbars.length > 0}
	<div
		bind:this={viewportElement}
		class="snackbar-viewport"
		aria-live="polite"
		aria-relevant="additions removals"
	>
		{#each snackbars as snackbar (snackbar.id)}
			<div
				class="snackbar-shell"
				animate:flipAnimation={{ duration: 180 }}
				transition:snackbarTransition
			>
				<SnackbarItem item={snackbar} onDismiss={dismissSnackbar} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.snackbar-viewport {
		z-index: 1100;
		display: flex;
		flex-direction: column-reverse;
		align-items: flex-end;
		gap: 12px;
		pointer-events: none;
	}

	.snackbar-shell {
		pointer-events: auto;
		will-change: transform, opacity;
	}

	@media (max-width: 767px) {
		.snackbar-viewport {
			width: calc(100vw - 24px);
			align-items: stretch;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.snackbar-shell {
			will-change: auto;
		}
	}
</style>
