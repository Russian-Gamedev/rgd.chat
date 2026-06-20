<script lang="ts">
type Props = {
	src: string;
	alt?: string;
	class?: string;
	fallbackSrc?: string | null;
	loading?: 'eager' | 'lazy';
};

let {
	src,
	alt = '',
	class: className = '',
	fallbackSrc = null,
	loading = 'lazy'
}: Props = $props();

let isLoaded = $state(false);
let didFallback = $state(false);
let lastSrc = $state<string | null>(null);

$effect(() => {
	if (src !== lastSrc) {
		lastSrc = src;
		isLoaded = false;
		didFallback = false;
	}
});

const currentSrc = $derived(didFallback && fallbackSrc ? fallbackSrc : src);

function handleError() {
	if (fallbackSrc && !didFallback) {
		didFallback = true;
		return;
	}

	isLoaded = true;
}
</script>

<span class={`skeleton-image ${className}`} class:is-loaded={isLoaded}>
	<img
		src={currentSrc}
		{alt}
		{loading}
		onload={() => {
			isLoaded = true;
		}}
		onerror={handleError}
	/>
</span>

<style>
	.skeleton-image {
		background-color: var(--color-bg);
		display: block;
		overflow: hidden;
		position: relative;
	}

	.skeleton-image::before {
		background: linear-gradient(
			110deg,
			color-mix(in srgb, var(--color-bg-surface) 72%, var(--color-bg)) 0%,
			color-mix(in srgb, var(--color-bg-surface) 88%, var(--color-text)) 42%,
			color-mix(in srgb, var(--color-bg-surface) 72%, var(--color-bg)) 84%
		);
		background-size: 220% 100%;
		content: "";
		inset: 0;
		position: absolute;
		animation: skeleton-image-shimmer 1.4s ease-in-out infinite;
	}

	.skeleton-image.is-loaded::before {
		opacity: 0;
	}

	img {
		display: block;
		height: 100%;
		inset: 0;
		object-fit: cover;
		opacity: 0;
		position: absolute;
		transition: opacity 180ms ease;
		width: 100%;
	}

	.is-loaded img {
		opacity: 1;
	}

	@keyframes skeleton-image-shimmer {
		from {
			background-position: 120% 0;
		}

		to {
			background-position: -120% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-image::before {
			animation: none;
		}

		img {
			transition: none;
		}
	}
</style>
