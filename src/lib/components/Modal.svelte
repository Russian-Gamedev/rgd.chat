<script lang="ts">
import type { Snippet } from 'svelte';
import { tick } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';

import { browser } from '$app/environment';

type ModalProps = {
	open: boolean;
	title: string;
	onClose: () => void;
	shakeToken?: number;
	children?: Snippet;
};

let { open, title, onClose, shakeToken = 0, children }: ModalProps = $props();

const titleId = $props.id();
let panel: HTMLDivElement | null = $state(null);
let previouslyFocused: HTMLElement | null = null;
let isShaking = $state(false);
let lastShakeToken = 0;

function prefersReducedMotion() {
	return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function backdropTransition(_node: Element, { duration = 160 } = {}): TransitionConfig {
	if (prefersReducedMotion()) {
		return { duration: 0 };
	}

	return {
		duration,
		css: (t) => `opacity: ${t}`
	};
}

function panelTransition(_node: Element, { duration = 180 } = {}): TransitionConfig {
	if (prefersReducedMotion()) {
		return { duration: 0 };
	}

	return {
		duration,
		css: (t, u) => `
			opacity: ${t};
			transform: translateY(${u * 10}px) scale(${0.98 + t * 0.02});
		`
	};
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

function getFocusableElements() {
	if (!panel) {
		return [];
	}

	return Array.from(
		panel.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
		)
	).filter((element) => element.offsetParent !== null || element === document.activeElement);
}

function focusFirstElement() {
	const [firstElement] = getFocusableElements();
	(firstElement ?? panel)?.focus();
}

function handleKeydown(event: KeyboardEvent) {
	if (!open) {
		return;
	}

	if (event.key === 'Escape') {
		event.preventDefault();
		onClose();
		return;
	}

	if (event.key !== 'Tab') {
		return;
	}

	const focusableElements = getFocusableElements();

	if (focusableElements.length === 0) {
		event.preventDefault();
		panel?.focus();
		return;
	}

	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	if (event.shiftKey && document.activeElement === firstElement) {
		event.preventDefault();
		lastElement.focus();
		return;
	}

	if (!event.shiftKey && document.activeElement === lastElement) {
		event.preventDefault();
		firstElement.focus();
	}
}

$effect(() => {
	if (!browser || !open) {
		return;
	}

	previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	const previousOverflow = document.body.style.overflow;
	document.body.style.overflow = 'hidden';

	tick().then(focusFirstElement);

	return () => {
		document.body.style.overflow = previousOverflow;
		previouslyFocused?.focus();
		previouslyFocused = null;
	};
});

$effect(() => {
	if (!browser || !open || shakeToken <= 0 || shakeToken === lastShakeToken) {
		return;
	}

	lastShakeToken = shakeToken;
	isShaking = true;

	const timeout = setTimeout(() => {
		isShaking = false;
	}, 450);

	return () => clearTimeout(timeout);
});
</script>

{#if open}
	<div class="modal-root" use:portal>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="modal-backdrop"
			transition:backdropTransition
			onclick={onClose}
			onkeydown={handleKeydown}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={panel}
				class="modal-panel"
				class:shaking={isShaking}
				transition:panelTransition
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabindex="-1"
				onclick={(event) => event.stopPropagation()}
				onkeydown={handleKeydown}
			>
				<div class="modal-header">
					<h2 id={titleId}>{title}</h2>
					<button class="modal-close" type="button" aria-label="Закрыть" onclick={onClose}>
						×
					</button>
				</div>
				<div class="modal-content">
					{@render children?.()}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-root {
		position: fixed;
		inset: 0;
		z-index: 1000;
	}

	.modal-backdrop {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 24px;
		background: rgba(0, 0, 0, 0.72);
	}

	.modal-panel {
		width: min(720px, 100%);
		max-height: min(760px, calc(100vh - 48px));
		overflow: auto;
		border: 1px solid #2a2c33;
		border-radius: 8px;
		background: var(--color-bg);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
	}

	.modal-panel:focus {
		outline: none;
	}

	.modal-panel.shaking {
		animation: modal-shake 0.4s ease;
	}

	@keyframes modal-shake {
		0%,
		100% {
			transform: translateX(0);
		}

		20% {
			transform: translateX(-8px);
		}

		40% {
			transform: translateX(8px);
		}

		60% {
			transform: translateX(-4px);
		}

		80% {
			transform: translateX(4px);
		}
	}

	.modal-panel::-webkit-scrollbar {
		width: 14px;
		background-color: var(--color-bg-surface);
	}

	.modal-panel::-webkit-scrollbar-thumb {
		border: 4px solid rgba(0, 0, 0, 0);
		border-radius: 1rem;
		background-clip: padding-box;
		background-color: var(--color-primary);
	}

	.modal-header {
		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 24px;
		border-bottom: 1px solid #2a2c33;
		background: var(--color-bg);
	}

	h2 {
		margin: 0;
		font-size: 20px;
		line-height: 1.2;
	}

	.modal-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: 1px solid #2a2c33;
		border-radius: 8px;
		background: var(--color-bg-surface);
		color: var(--color-text);
		font-size: 24px;
		line-height: 1;
		cursor: pointer;
	}

	.modal-close:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.modal-content {
		padding: 24px;
	}

	@media (max-width: 767px) {
		.modal-backdrop {
			align-items: flex-end;
			padding: 12px;
		}

		.modal-panel {
			max-height: calc(100vh - 24px);
		}
	}
</style>
