<script lang="ts">
import { onMount } from 'svelte';

import { page } from '$app/state';
import {
	IconCrown,
	IconDiscord,
	IconFeed,
	IconJam,
	IconJoystick,
	IconRgd,
	IconVideo
} from '$lib/assets/icons';
import Button from '$lib/components/Button.svelte';

const navItems = [
	// { name: "Игры", href: "/games", icon: IconJoystick },
	// { name: "Джемы", href: "/jams", icon: IconJam },
	// { name: "Блоги", href: "/blogs", icon: IconFeed },
	{ name: 'Донатеры', href: '/patrons', icon: IconCrown },
	{ name: 'Видео', href: '/videos', icon: IconVideo }
];

const pathname = $derived(page.url.pathname);
const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

let navElement: HTMLElement;
let canScrollLeft = $state(false);
let canScrollRight = $state(false);

const updateScrollState = () => {
	if (!navElement) return;

	canScrollLeft = navElement.scrollLeft > 1;
};

onMount(() => {
	updateScrollState();
	requestAnimationFrame(updateScrollState);

	const resizeObserver = new ResizeObserver(updateScrollState);
	resizeObserver.observe(navElement);

	if (navElement.firstElementChild) {
		resizeObserver.observe(navElement.firstElementChild);
	}

	const listElement = navElement.firstElementChild;
	const firstItem = listElement?.firstElementChild;
	const lastItem = listElement?.lastElementChild;
	const intersectionObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.target === firstItem) {
					canScrollLeft = !entry.isIntersecting || navElement.scrollLeft > 1;
				}

				if (entry.target === lastItem) {
					canScrollRight = !entry.isIntersecting;
				}
			}
		},
		{ root: navElement, threshold: 0.99 }
	);

	if (firstItem) {
		intersectionObserver.observe(firstItem);
	}

	if (lastItem) {
		intersectionObserver.observe(lastItem);
	}

	window.addEventListener('resize', updateScrollState);

	return () => {
		resizeObserver.disconnect();
		intersectionObserver.disconnect();
		window.removeEventListener('resize', updateScrollState);
	};
});
</script>

<aside class="navbar">
	<a href="/" class="logo">
		<IconRgd />
	</a>
	<div
		class:can-scroll-left={canScrollLeft}
		class:can-scroll-right={canScrollRight}
		class="nav-scroll"
	>
		<nav bind:this={navElement} onscroll={updateScrollState} aria-label="Основная навигация">
			<ul>
				{#each navItems as item (item.href)}
					<li>
						<a
							href={item.href}
							aria-current={isActive(item.href) ? 'page' : undefined}
							class:active={isActive(item.href)}
							class="link"
						>
							<span class="link-icon" aria-hidden="true">
								<item.icon />
							</span>
							<span>{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
	<div class="auth-slot">
		<Button color="bg" class="auth-button">
			<div class="auth-icon">
				<IconDiscord />
			</div>
			<span>Авторизация</span>
		</Button>
	</div>
</aside>

<style>
	.navbar {
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
		width: clamp(240px, 24vw, 360px);
		height: 100vh;
		padding: 64px 40px;
		background-color: var(--color-bg-surface);
		border-right: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
		z-index: 10;
	}

	nav {
		padding-top: 64px;
		min-width: 0;
	}

	.nav-scroll {
		min-width: 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		gap: 24px;
		display: flex;
		flex-direction: column;
	}

	li {
		display: flex;
		align-items: center;
		font-size: 20px;
	}

	.logo {
		color: var(--color-text);
		width: fit-content;
		display: inline-flex;
		align-items: center;
		transition:
			color 200ms ease,
			transform 200ms ease;
	}

	.logo:hover,
	.logo:focus-visible {
		color: var(--color-primary);
		transform: translateY(-1px);
		outline: none;
	}

	.link {
		color: var(--color-text-secondary);
		text-decoration: none;
		transition:
			color 200ms ease,
			background-color 200ms ease,
			transform 200ms ease;
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		min-height: 44px;
		border-radius: 8px;
		padding: 6px 10px;
	}

	.link-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
	}

	.link:active,
	.link:hover,
	.link:focus-visible,
	.link.active {
		color: var(--color-text);
		background-color: color-mix(in srgb, var(--color-primary) 14%, transparent);
		outline: none;
	}

	.link:hover,
	.link:focus-visible {
		transform: translateX(4px);
	}

	.auth-slot {
		margin-top: auto;
		display: flex;
		justify-content: center;
	}

	:global(.auth-button) {
		min-width: 0;
		white-space: nowrap;
	}

	.auth-icon {
		color: var(--color-text);
		background-color: var(--color-primary);
		border-radius: 0.75rem;
		padding: 0.625rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
	}

	@media (max-width: 767px) {
		.navbar {
			width: 100%;
			max-width: 100vw;
			height: auto;
			flex-direction: row;
			align-items: center;
			gap: 12px;
			padding: 12px 16px;
			border-right: none;
			border-bottom: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
			overflow: hidden;
		}

		.logo {
			flex: 0 0 auto;
		}

		.logo :global(svg) {
			height: 32px;
		}

		.nav-scroll {
			flex: 1 1 auto;
			order: 2;
			position: relative;
			min-width: 0;
			overflow: hidden;
		}

		.nav-scroll::before,
		.nav-scroll::after {
			position: absolute;
			top: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			z-index: 1;
			color: var(--color-text);
			font-size: 20px;
			font-weight: 700;
			line-height: 1;
			pointer-events: none;
			opacity: 0;
			transition: opacity 160ms ease;
		}

		.nav-scroll::before {
			content: '‹';
			left: 0;
			background: linear-gradient(90deg, var(--color-bg-surface) 35%, transparent 100%);
		}

		.nav-scroll::after {
			content: '›';
			right: 0;
			background: linear-gradient(270deg, var(--color-bg-surface) 35%, transparent 100%);
		}

		.nav-scroll.can-scroll-left::before,
		.nav-scroll.can-scroll-right::after {
			opacity: 0.8;
		}

		nav {
			width: 100%;
			max-width: 100%;
			padding-top: 0;
			overflow-x: auto;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.nav-scroll.can-scroll-left.can-scroll-right nav {
			mask-image: linear-gradient(
				90deg,
				transparent 0,
				#000 20px,
				#000 calc(100% - 20px),
				transparent 100%
			);
		}

		.nav-scroll.can-scroll-left:not(.can-scroll-right) nav {
			mask-image: linear-gradient(90deg, transparent 0, #000 20px, #000 100%);
		}

		.nav-scroll.can-scroll-right:not(.can-scroll-left) nav {
			mask-image: linear-gradient(90deg, #000 0, #000 calc(100% - 20px), transparent 100%);
		}

		nav::-webkit-scrollbar {
			display: none;
		}

		ul {
			flex-direction: row;
			align-items: center;
			gap: 8px;
			width: max-content;
		}

		li {
			font-size: 16px;
			flex: 0 0 auto;
		}

		.link {
			gap: 0;
			min-height: 40px;
			padding: 8px 12px;
		}

		.link:hover,
		.link:focus-visible {
			transform: translateY(-1px);
		}

		.link-icon {
			display: none;
		}

		.auth-slot {
			order: 3;
			flex: 0 0 auto;
			margin-top: 0;
			justify-content: flex-end;
		}

		:global(.auth-button) {
			padding: 0.25rem;
			gap: 0;
		}

		:global(.auth-button span) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
		}

		.auth-icon {
			width: 2rem;
			height: 2rem;
			padding: 0.375rem;
			border-radius: 0.625rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.logo,
		.link,
		.nav-scroll::before,
		.nav-scroll::after {
			transition: none;
		}

		.logo:hover,
		.logo:focus-visible,
		.link:hover,
		.link:focus-visible {
			transform: none;
		}
	}
</style>
