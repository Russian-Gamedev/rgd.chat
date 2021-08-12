<script lang="ts">
	import { page } from '$app/stores';
	import LoginButton from '$lib/header/LoginButton.svelte';
</script>

<header>
	<div>
		<a href="/">
			<img src="logo.svg" alt="RGD" />
		</a>
	</div>
	<LoginButton />
	<nav role="menu">
		<!-- <ul>
			<li>
				<a></a>
			</li>
		</ul> -->
		<a
			id="jams"
			role="menuitem"
			class:active={$page.path === '/jams'}
			aria-current={$page.path === '/jams' ? 'page' : false}
			href="/jams"
		>
			<img src="icons/jams.svg" alt="Джем" />
			<span>ДЖЕМЫ</span>
		</a>
		<a
			id="sponsors"
			role="menuitem"
			class:active={$page.path === '/sponsors'}
			aria-current={$page.path === '/sponsors' ? 'page' : false}
			href="/sponsors"
		>
			<img src="icons/sponsors.svg" alt="Сердечко" />
			<span>СПОНСОРЫ</span>
		</a>
	</nav>
</header>

<style>
	header {
		flex: 0 0 18rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		background-color: var(--secondary-color);
	}

	div {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		/* ^ align-self: stretch; is not supported by safari */
		height: 7rem;
	}

	div a {
		display: flex;
	}

	div img {
		width: 4rem;
	}

	nav {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* ^ align-self: stretch; is not supported by safari */
	}

	nav a {
		display: flex;
		align-items: center;
		padding-left: 2.8rem;
		gap: 1.4rem;
		height: 3.5rem;
	}

	nav a.active {
		background-color: var(--tertiary-color);
	}

	nav a.active::before {
		position: absolute;
		left: -0.16em;
		content: '•';
		font-size: 2.8em;
		color: var(--pure-white);
	}

	nav a img {
		width: 1.8rem;
	}

	nav a {
		color: var(--dimmed-text-color);
	}

	nav a.active,
	nav a:hover {
		color: var(--pure-white);
	}

	nav a:hover {
		text-decoration: none;
	}

	nav span {
		font-size: 0.85em;
		font-weight: bold;
		letter-spacing: 0.05em;
	}
</style>
