<script lang="ts">
	import { page } from '$app/stores';
	import RGDLogo from '$lib/sidemenu/RGDLogo.svelte';
	import LoginButton from '$lib/sidemenu/LoginButton.svelte';
</script>

<aside>
	<a class="logo" href="/">
		<RGDLogo />
	</a>
	<LoginButton />
	<nav>
		<ul>
			<!-- <li class:active={$page.path === 'articles'}><a href="/articles">Блоги</a></li> -->
			<li class:active={$page.path === 'jams'}><a href="/jams">Джемы</a></li>
			<li class:active={$page.path === 'sponsors'}><a href="/sponsors">Спонсоры</a></li>
		</ul>
	</nav>
</aside>

<style>
	aside {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
</style>
