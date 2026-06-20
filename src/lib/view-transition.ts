import type { OnNavigate } from '@sveltejs/kit';

export function shouldUseViewTransition(navigation: OnNavigate): boolean {
	if (typeof document === 'undefined') return false;
	if (!document.startViewTransition) return false;
	if (navigation.willUnload) return false;

	const samePath = navigation.from?.url.pathname === navigation.to?.url.pathname;
	if (samePath) return false;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) return false;

	return true;
}

export function startPageViewTransition(navigation: OnNavigate): Promise<void> | undefined {
	if (!shouldUseViewTransition(navigation)) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
}
