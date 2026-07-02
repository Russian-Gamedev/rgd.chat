<script lang="ts">
import { onMount } from 'svelte';

import { page } from '$app/state';
import { createApi } from '$lib/api/api';
import type { User } from '$lib/api/api.type';
import {
	IconArrowUp,
	IconCrown,
	IconDiscord,
	IconFeed,
	IconHash,
	IconJam,
	IconJoystick,
	IconRgd,
	IconVideo
} from '$lib/assets/icons';
import Button from '$lib/components/Button.svelte';

let user = $state<User | null>(null);
let isCollapsed = $state(false);

const redirectToAuth = () => {
	window.location.href = import.meta.env.VITE_AUTH_URL;
};

const sidebarStorageKey = 'rgd.sidebar.collapsed';
const sidebarDesktopQuery = '(min-width: 768px)';

const getStoredSidebarCollapsed = () => {
	try {
		return window.localStorage.getItem(sidebarStorageKey) === 'true';
	} catch {
		return false;
	}
};

const getCurrentSidebarCollapsed = () =>
	document.documentElement.dataset.sidebarCollapsed === 'true' || getStoredSidebarCollapsed();

const setSidebarCollapsed = (collapsed: boolean) => {
	document.documentElement.dataset.sidebarCollapsed = String(collapsed);

	try {
		window.localStorage.setItem(sidebarStorageKey, String(collapsed));
	} catch {
		// Storage may be unavailable in restrictive browser contexts.
	}
};

const syncCollapsedForViewport = (isDesktop: boolean) => {
	const nextCollapsed = isDesktop ? getCurrentSidebarCollapsed() : false;
	isCollapsed = nextCollapsed;
	document.documentElement.dataset.sidebarCollapsed = String(nextCollapsed);
};

const toggleCollapsed = () => {
	const nextCollapsed = !isCollapsed;
	isCollapsed = nextCollapsed;
	setSidebarCollapsed(nextCollapsed);
};

const navItems = $derived([
	// { name: "Игры", href: "/games", icon: IconJoystick },
	// { name: "Джемы", href: "/jams", icon: IconJam },
	// { name: "Блоги", href: "/blogs", icon: IconFeed },
	{ name: 'Донатеры', href: '/patrons', icon: IconCrown },
	{ name: 'Видео', href: '/videos', icon: IconVideo },
	...(user ? [{ name: 'MOTD', href: '/motd', icon: IconHash }] : [])
]);

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
	const desktopMediaQuery = window.matchMedia(sidebarDesktopQuery);
	syncCollapsedForViewport(desktopMediaQuery.matches);

	const onDesktopMediaQueryChange = (event: MediaQueryListEvent) => {
		syncCollapsedForViewport(event.matches);
	};

	desktopMediaQuery.addEventListener('change', onDesktopMediaQueryChange);

	createApi({ fetch })
		.getMe()
		.then((u) => (user = u))
		.catch(() => (user = null));
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
		desktopMediaQuery.removeEventListener('change', onDesktopMediaQueryChange);
		resizeObserver.disconnect();
		intersectionObserver.disconnect();
		window.removeEventListener('resize', updateScrollState);
	};
});
</script>

<aside class:collapsed={isCollapsed} class="navbar">
  <div class="navbar-header">
    <a href="/" class="logo" aria-label="RGD">
      <IconRgd />
    </a>
    <button
      type="button"
      class="collapse-button"
      aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
      aria-pressed={isCollapsed}
      onclick={toggleCollapsed}
    >
      <IconArrowUp />
    </button>
  </div>
  <div
    class:can-scroll-left={canScrollLeft}
    class:can-scroll-right={canScrollRight}
    class="nav-scroll"
  >
    <nav
      bind:this={navElement}
      onscroll={updateScrollState}
      aria-label="Основная навигация"
    >
      <ul>
        {#each navItems as item (item.href)}
          <li>
            <a
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              class:active={isActive(item.href)}
              class="link"
            >
              <span class="link-icon" aria-hidden="true">
                <item.icon />
              </span>
              <span class="link-label">{item.name}</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
  <div class="auth-slot">
    {#if user}
      <div class="user-block">
        <img
          class="user-avatar"
          src={user.avatar_url}
          alt={user.nickname ?? user.username}
        />
        <span class="user-username">{user.nickname ?? user.username}</span>
      </div>
    {:else}
      <Button
        color="bg"
        class="auth-button"
        aria-label="Авторизация"
        onclick={redirectToAuth}
      >
        <div class="auth-icon">
          <IconDiscord />
        </div>
        <span class="auth-label">Авторизация</span>
      </Button>
    {/if}
  </div>
</aside>

<style>
  .navbar {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    width: clamp(240px, 24vw, 300px);
    height: 100vh;
    padding: 64px 40px;
    background-color: var(--color-bg-surface);
    border-right: 1px solid
      color-mix(in srgb, var(--color-text) 8%, transparent);
    z-index: 10;
  }

  .navbar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
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

  .logo :global(svg) {
    transition:
      width 180ms ease,
      height 180ms ease;
  }

  .collapse-button {
    border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-text-secondary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    padding: 8px;
    transition:
      border-color 200ms ease,
      color 200ms ease,
      transform 200ms ease;
  }

  .collapse-button :global(svg) {
    width: 20px;
    height: 20px;
    transform: rotate(-90deg);
    transition: transform 200ms ease;
  }

  .collapse-button:hover,
  .collapse-button:focus-visible {
    border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
    color: var(--color-text);
    outline: none;
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

  .link-label,
  .auth-label,
  .user-username {
    max-width: 180px;
    opacity: 1;
    overflow: hidden;
    transition:
      max-width 160ms ease,
      opacity 120ms ease;
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

  .user-block {
    display: flex;
    align-items: center;
    gap: 16px;
    width: content;
    padding: 8px 16px;
    border-radius: 8px;
    background: var(--color-bg);
    cursor: pointer;
    transition: transform 200ms ease;
  }

  .user-block:hover,
  .user-block:focus-visible {
    transform: scale(1.05);
  }

  .user-avatar {
    background-color: var(--color-bg);
    border-radius: 9px;
    flex: 0 0 auto;
    height: 32px;
    width: 32px;
    object-fit: cover;
  }

  .user-username {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    .navbar {
      overflow: hidden;
      transition:
        width 200ms ease,
        padding 200ms ease;
    }

    :global(html[data-sidebar-collapsed="true"]) .navbar,
    .navbar.collapsed {
      width: 96px;
      padding-inline: 16px;
    }

    :global(html[data-sidebar-collapsed="true"]) .navbar-header,
    .navbar.collapsed .navbar-header {
      justify-content: center;
      flex-direction: column;
      gap: 12px;
    }

    :global(html[data-sidebar-collapsed="true"]) .logo :global(svg),
    .navbar.collapsed .logo :global(svg) {
      width: 40px;
      height: 40px;
    }

    :global(html[data-sidebar-collapsed="true"]) .collapse-button :global(svg),
    .navbar.collapsed .collapse-button :global(svg) {
      transform: rotate(90deg);
    }

    :global(html[data-sidebar-collapsed="true"]) nav,
    .navbar.collapsed nav {
      padding-top: 48px;
    }

    :global(html[data-sidebar-collapsed="true"]) ul,
    .navbar.collapsed ul {
      align-items: center;
    }

    :global(html[data-sidebar-collapsed="true"]) li,
    :global(html[data-sidebar-collapsed="true"]) .link,
    .navbar.collapsed li,
    .navbar.collapsed .link {
      width: 100%;
    }

    :global(html[data-sidebar-collapsed="true"]) .link,
    .navbar.collapsed .link {
      justify-content: center;
      gap: 0;
      padding: 10px;
    }

    :global(html[data-sidebar-collapsed="true"]) .link:hover,
    :global(html[data-sidebar-collapsed="true"]) .link:focus-visible,
    .navbar.collapsed .link:hover,
    .navbar.collapsed .link:focus-visible {
      transform: none;
    }

    :global(html[data-sidebar-collapsed="true"]) .link-label,
    :global(html[data-sidebar-collapsed="true"]) .user-username,
    :global(html[data-sidebar-collapsed="true"]) .auth-label,
    .navbar.collapsed .link-label,
    .navbar.collapsed .user-username,
    .navbar.collapsed .auth-label {
      max-width: 0;
      opacity: 0;
    }

    :global(html[data-sidebar-collapsed="true"]) .auth-slot,
    .navbar.collapsed .auth-slot {
      justify-content: center;
    }

    :global(html[data-sidebar-collapsed="true"]) :global(.auth-button),
    .navbar.collapsed :global(.auth-button) {
      padding: 0.25rem;
      gap: 0;
    }

    :global(html[data-sidebar-collapsed="true"]) .user-block,
    .navbar.collapsed .user-block {
      padding: 0;
      gap: 0;
      background: transparent;
    }
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
      border-bottom: 1px solid
        color-mix(in srgb, var(--color-text) 8%, transparent);
      overflow: hidden;
    }

    .logo {
      flex: 0 0 auto;
    }

    .collapse-button {
      display: none;
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
      content: "‹";
      left: 0;
      background: linear-gradient(
        90deg,
        var(--color-bg-surface) 35%,
        transparent 100%
      );
    }

    .nav-scroll::after {
      content: "›";
      right: 0;
      background: linear-gradient(
        270deg,
        var(--color-bg-surface) 35%,
        transparent 100%
      );
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
      mask-image: linear-gradient(
        90deg,
        #000 0,
        #000 calc(100% - 20px),
        transparent 100%
      );
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

    .user-block {
      width: auto;
      padding: 0;
      gap: 0;
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
    }

    .user-username {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .logo,
    .link,
    .link-label,
    .auth-label,
    .user-username,
    .collapse-button,
    .collapse-button :global(svg),
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
