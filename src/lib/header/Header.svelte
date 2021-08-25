<script lang="ts">
	import { page, session } from '$app/stores';
	import LoginButton from '$lib/header/LoginButton.svelte';
	import Account from '$lib/header/Account.svelte';
</script>

<header>
	<div class="header__wrapper">
		<div role="banner" class="logo">
			<a class="logo__link" href="/">
				<img class="logo__image" src="logo.svg" alt="RGD" />
			</a>
		</div>

		<nav class="menu">
			<a
				sveltekit:prefetch
				role="menuitem"
				class="menu__item menu__item--games"
				class:menu__item--active={$page.path === '/games'}
				aria-current={$page.path === '/games' ? 'page' : false}
				href="/games"
			>
				Сообщество
			</a>
			<a
				sveltekit:prefetch
				role="menuitem"
				class="menu__item menu__item--jams"
				class:menu__item--active={$page.path === '/jams'}
				aria-current={$page.path === '/jams' ? 'page' : false}
				href="/jams"
			>
				Джемы
			</a>
			<a
				sveltekit:prefetch
				role="menuitem"
				class="menu__item menu__item--blogs"
				class:menu__item--active={$page.path === '/blogs'}
				aria-current={$page.path === '/blogs' ? 'page' : false}
				href="/blogs"
			>
				Туториалы
			</a>
			<a
				sveltekit:prefetch
				role="menuitem"
				class="menu__item menu__item--sponsors"
				class:menu__item--active={$page.path === '/sponsors'}
				aria-current={$page.path === '/sponsors' ? 'page' : false}
				href="/sponsors"
			>
				Поддержка
			</a>
		</nav>

		<div class="bottom-one">
			{#if $session.authorized}
				<Account />
			{:else}
				<LoginButton />
			{/if}
		</div>
	</div>
</header>

<style>
	header {
		flex-shrink: 0;
		flex-basis: var(--header-width);
		/* gap: 0.8rem; */

		background-color: var(--secondary-background);
		/* box-shadow: 0 -100vh 0 var(--text-color); */
	}

	.header__wrapper {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		height: 100vh;

		flex: 0 0 var(--header-width);
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
	}

	.logo {
		display: flex;
		justify-content: start;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		/* ^ align-self: stretch; is not supported by safari */
		padding: 3.2rem 2.45rem;
	}

	.logo__link {
		display: flex;
	}

	.logo__image {
		width: 2.6rem;
		height: 2.7rem;
	}

	.menu {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* ^ align-self: stretch; is not supported by safari */
	}

	.menu__item {
		display: flex;
		align-items: center;
		height: 2.8rem;
		padding-left: 4.8rem;
		font-size: 0.75rem;
		color: var(--dimmed);
	}

	.menu__item--active,
	.menu__item:hover,
	.menu__item--active::before,
	.menu__item:hover::before {
		color: var(--pure-white);
		/* To make svg's white */
		filter: brightness(0) invert(1);
	}

	.menu__item::before {
		position: absolute;
		margin-left: -2.4rem;
		width: 1.6rem;
		height: 1.6rem;
	}

	.menu__item--games::before {
		content: url('/icons/social.svg');
	}

	.menu__item--jams::before {
		content: url('/icons/jam.svg');
	}

	.menu__item--blogs::before {
		content: url('/icons/tutorial.svg');
	}

	.menu__item--sponsors::before {
		content: url('/icons/sponsor.svg');
	}

	.menu__item:hover {
		text-decoration: none;
	}

	/* .menu__link {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-left: 5.6rem;
		color: var(--dimmed-text-color);
	} */

	.bottom-one {
		margin-bottom: 6rem;
	}
</style>
