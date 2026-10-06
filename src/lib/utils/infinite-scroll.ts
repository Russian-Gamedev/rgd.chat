export function createInfiniteScrollObserver(node: HTMLElement, onIntersect: () => void) {
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				onIntersect();
			}
		},
		{ rootMargin: '400px 0px' }
	);

	observer.observe(node);

	return () => observer.disconnect();
}
