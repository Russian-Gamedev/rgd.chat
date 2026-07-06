<script lang="ts">
import {
	arrow as arrowMiddleware,
	autoUpdate,
	computePosition,
	flip,
	offset as offsetMiddleware,
	type Placement,
	type Strategy,
	shift
} from '@floating-ui/dom';

import type { Snippet } from 'svelte';

import { browser } from '$app/environment';

type PopoutMode = 'hover' | 'click' | 'always' | 'manual';
type PopoutRole = 'tooltip' | 'dialog' | 'menu' | 'none';
type PopoutSide = 'top' | 'right' | 'bottom' | 'left';

export type PopoutApi = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	update: () => Promise<void>;
};

type TailState = {
	side: PopoutSide;
	placement: Placement;
};

type PopoutProps = {
	mode?: PopoutMode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	placement?: Placement;
	offset?: number;
	collisionPadding?: number;
	strategy?: Strategy;
	interactive?: boolean;
	tail?: boolean | Snippet<[TailState]>;
	tailSize?: number;
	tailPadding?: number;
	role?: PopoutRole;
	openDelay?: number;
	closeDelay?: number;
	api?: PopoutApi;
	trigger: Snippet;
	content: Snippet;
};

let {
	mode = 'hover',
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	placement = 'top',
	offset = 8,
	collisionPadding = 8,
	strategy = 'absolute',
	interactive = false,
	tail = true,
	tailSize = 8,
	tailPadding = 4,
	role,
	openDelay = 120,
	closeDelay = 80,
	api = $bindable(),
	trigger,
	content
}: PopoutProps = $props();

const contentId = $props.id();
const tailOffset = $derived(Math.ceil(tailSize / 2));
const shouldRenderTail = $derived(Boolean(tail));
const defaultRole = $derived(role ?? (mode === 'hover' ? 'tooltip' : 'dialog'));
let localOpen = $state(getInitialOpen());
let triggerElement: HTMLSpanElement | null = $state(null);
let contentElement: HTMLDivElement | null = $state(null);
let tailElement: HTMLDivElement | null = $state(null);
let actualPlacement = $state<Placement>(getInitialPlacement());
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const resolvedRole = $derived(defaultRole === 'none' ? undefined : defaultRole);
const isControlled = $derived(controlledOpen !== undefined);
const isOpen = $derived(
	mode === 'always' ? true : isControlled ? Boolean(controlledOpen) : localOpen
);

const actualSide = $derived(actualPlacement.split('-')[0] as PopoutSide);
const customTail = $derived(typeof tail === 'function' ? tail : undefined);

function getInitialOpen() {
	return defaultOpen;
}

function getInitialPlacement() {
	return placement;
}

function portal(node: HTMLElement) {
	if (!browser) {
		return;
	}

	document.body.appendChild(node);

	return {
		destroy() {
			node.remove();
		}
	};
}

function clearOpenTimer() {
	if (openTimer) {
		clearTimeout(openTimer);
		openTimer = undefined;
	}
}

function clearCloseTimer() {
	if (closeTimer) {
		clearTimeout(closeTimer);
		closeTimer = undefined;
	}
}

function setOpen(nextOpen: boolean) {
	if (mode === 'always') {
		return;
	}

	if (!isControlled) {
		localOpen = nextOpen;
	}

	onOpenChange?.(nextOpen);
}

function openNow() {
	clearCloseTimer();
	setOpen(true);
}

function closeNow() {
	clearOpenTimer();
	setOpen(false);
}

function scheduleOpen() {
	if (mode !== 'hover') {
		return;
	}

	clearCloseTimer();
	clearOpenTimer();
	openTimer = setTimeout(openNow, openDelay);
}

function scheduleClose() {
	if (mode !== 'hover') {
		return;
	}

	clearOpenTimer();
	clearCloseTimer();
	closeTimer = setTimeout(closeNow, closeDelay);
}

async function updatePosition() {
	if (!browser || !triggerElement || !contentElement || !isOpen) {
		return;
	}

	const middleware = [
		offsetMiddleware(offset + (shouldRenderTail ? tailOffset : 0)),
		flip(),
		shift({ padding: collisionPadding })
	];

	if (shouldRenderTail && tailElement) {
		middleware.push(arrowMiddleware({ element: tailElement, padding: tailPadding }));
	}

	const nextPosition = await computePosition(triggerElement, contentElement, {
		placement,
		strategy,
		middleware
	});

	actualPlacement = nextPosition.placement;

	Object.assign(contentElement.style, {
		left: `${nextPosition.x}px`,
		top: `${nextPosition.y}px`,
		position: strategy
	});

	if (!tailElement || !nextPosition.middlewareData.arrow) {
		return;
	}

	const { x, y } = nextPosition.middlewareData.arrow;
	const staticSide = {
		top: 'bottom',
		right: 'left',
		bottom: 'top',
		left: 'right'
	}[actualSide];

	Object.assign(tailElement.style, {
		left: x != null ? `${x}px` : '',
		top: y != null ? `${y}px` : '',
		right: '',
		bottom: '',
		[staticSide]: `${-tailOffset}px`
	});
}

function handleTriggerClick() {
	if (mode !== 'click') {
		return;
	}

	setOpen(!isOpen);
}

function handleFocusIn() {
	if (mode === 'hover') {
		scheduleOpen();
	}
}

function handleFocusOut(event: FocusEvent) {
	if (mode !== 'hover') {
		return;
	}

	const nextTarget = event.relatedTarget;

	if (
		interactive &&
		nextTarget instanceof Node &&
		(contentElement?.contains(nextTarget) || triggerElement?.contains(nextTarget))
	) {
		return;
	}

	scheduleClose();
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape' && isOpen && mode !== 'always') {
		event.preventDefault();
		closeNow();
	}
}

api = {
	open: openNow,
	close: closeNow,
	toggle: () => setOpen(!isOpen),
	update: updatePosition
};

$effect(() => {
	if (!browser || !isOpen || !triggerElement || !contentElement) {
		return;
	}

	const cleanup = autoUpdate(triggerElement, contentElement, updatePosition);
	updatePosition();

	return cleanup;
});

$effect(() => {
	if (!browser || !isOpen || mode === 'always' || mode === 'hover') {
		return;
	}

	function handlePointerDown(event: PointerEvent) {
		const target = event.target;

		if (
			target instanceof Node &&
			(triggerElement?.contains(target) || contentElement?.contains(target))
		) {
			return;
		}

		closeNow();
	}

	document.addEventListener('pointerdown', handlePointerDown);

	return () => document.removeEventListener('pointerdown', handlePointerDown);
});

$effect(() => {
	if (!browser) {
		return;
	}

	return () => {
		clearOpenTimer();
		clearCloseTimer();
	};
});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={triggerElement}
	class="popout-trigger"
	aria-describedby={mode === 'hover' && isOpen ? contentId : undefined}
	aria-controls={mode !== 'hover' && isOpen ? contentId : undefined}
	aria-expanded={mode !== 'hover' ? isOpen : undefined}
	data-state={isOpen ? 'open' : 'closed'}
	onclick={handleTriggerClick}
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	onkeydown={handleKeydown}
	onpointerenter={mode === 'hover' ? scheduleOpen : undefined}
	onpointerleave={mode === 'hover' ? scheduleClose : undefined}
>
	{@render trigger()}
</span>

{#if isOpen}
	<div class="popout-portal" use:portal>
		<div
			bind:this={contentElement}
			id={contentId}
			class="popout-content"
			role={resolvedRole}
			data-state="open"
			data-side={actualSide}
			data-placement={actualPlacement}
			style:--popout-tail-size={`${tailSize}px`}
			onkeydown={handleKeydown}
			onpointerenter={interactive && mode === 'hover' ? clearCloseTimer : undefined}
			onpointerleave={interactive && mode === 'hover' ? scheduleClose : undefined}
		>
			{#if shouldRenderTail}
				<div
					bind:this={tailElement}
					class="popout-tail"
					aria-hidden="true"
					data-side={actualSide}
					style:width={`${tailSize}px`}
					style:height={`${tailSize}px`}
				>
					{#if customTail}
						{@render customTail({ side: actualSide, placement: actualPlacement })}
					{/if}
				</div>
			{/if}

			{@render content()}
		</div>
	</div>
{/if}

<style>
	.popout-trigger {
		display: inline-flex;
		width: fit-content;
	}

	.popout-content {
		z-index: 1100;
		width: max-content;
		max-width: min(360px, calc(100vw - 16px));
		padding: 10px 12px;
		border: 1px solid #2a2c33;
		border-radius: 8px;
		background: var(--color-bg);
		color: var(--color-text);
		box-shadow: 0 14px 40px rgba(0, 0, 0, 0.36);
		font-size: 14px;
		line-height: 1.35;
	}

	.popout-tail {
		position: absolute;
		z-index: -1;
		background: inherit;
		border: inherit;
		border-top-color: transparent;
		border-left-color: transparent;
		transform: rotate(45deg);
		pointer-events: none;
	}
</style>
