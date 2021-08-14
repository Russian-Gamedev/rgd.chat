<script lang="ts">
	import { page, session } from '$app/stores';
	import LoginButton from '$lib/header/LoginButton.svelte';
	import Account from '$lib/header/Account.svelte';
</script>

<header class="header">
	<div role="banner" class="logo">
		<a class="logo__link" href="/">
			<img class="logo__image" src="logo.svg" alt="RGD" />
		</a>
	</div>
	{#if $session.authorized}
		<Account />
	{:else}
		<LoginButton />
	{/if}
	<nav class="menu">
		<ul role="menu" class="menu__list">
			<li
				role="menuitem"
				class="menu__item"
				class:menu__item--active={$page.path === '/jams'}
				aria-current={$page.path === '/jams' ? 'page' : false}
			>
				<a sveltekit:prefetch class="menu__link menu__link--jams" href="/jams"> Джемы </a>
			</li>
			<li
				role="menuitem"
				class="menu__item"
				class:menu__item--active={$page.path === '/blogs'}
				aria-current={$page.path === '/blogs' ? 'page' : false}
			>
				<a sveltekit:prefetch class="menu__link" href="/blogs"> Блоги </a>
			</li>
			<li
				role="menuitem"
				class="menu__item"
				class:menu__item--active={$page.path === '/sponsors'}
				aria-current={$page.path === '/sponsors' ? 'page' : false}
			>
				<a sveltekit:prefetch class="menu__link menu__link--sponsors" href="/sponsors">
					Спонсоры
				</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		height: 100vh;

		flex: 0 0 18rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 0.8rem; */

		background-color: var(--secondary-color);
		box-shadow: 0 -100vh 0 var(--text-color);
	}

	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		/* ^ align-self: stretch; is not supported by safari */
		height: 7rem;
	}

	.logo__link {
		display: flex;
	}

	.logo__image {
		width: 4rem;
	}

	.menu {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* ^ align-self: stretch; is not supported by safari */
	}

	.menu__list {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.85em;
		font-weight: bold;
		letter-spacing: 0.05em;
	}

	.menu__item {
		display: flex;
		align-items: center;
		height: 3.5rem;
	}

	.menu__item:hover .menu__link {
		color: var(--pure-white);
	}

	.menu__item--active {
		background-color: var(--tertiary-color);
	}

	.menu__item--active .menu__link {
		color: var(--pure-white);
	}

	.menu__item--active::before {
		position: absolute;
		left: -0.16em;
		content: '•';
		font-size: 2.8em;
		color: var(--pure-white);
	}

	.menu__link::before {
		position: absolute;
		margin-left: -3.49em;
		width: 1.6rem;
	}

	.menu__link--jams::before {
		content: url('/icons/jams.svg');
		margin-top: 0.2em;
		margin-left: -3.53em;
		width: 1.8rem;
	}

	.menu__link--sponsors::before {
		content: url('/icons/sponsors.svg');
		margin-top: 0.5em;
	}

	.menu__link {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-left: 5.6rem;
		color: var(--dimmed-text-color);
		text-transform: uppercase;
	}

	.menu__link:hover {
		text-decoration: none;
	}
</style>
