<script lang="ts">
	import { page } from '$app/stores';
	import logo from './rgd-logo.svg';
</script>

<header>
	<a class="logo" href="/">
		<img src={logo} alt="RGD" />
	</a>
	<nav>
		<ul>
			<li><a class:active={$page.path === 'articles'} href="/articles">Articles</a></li>
			<li><a class:active={$page.path === 'jams'} href="/jams">Jams</a></li>
		</ul>
	</nav>
</header>

<style>
	header {
		/* flex: 0 1 4rem; */
		display: flex;
		position: sticky;
		top: 0;
		width: 100%;
		max-width: 1024px;
		height: 4rem;
		margin: 0 auto;
		padding: 0.5rem 1rem;
		box-sizing: border-box;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.logo,
	.logo img {
		height: 100%;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
	}

	li {
		position: relative;
		height: 100%;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
