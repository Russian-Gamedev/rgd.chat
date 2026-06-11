<script>
import { page } from '$app/state';
import NotFoundImage from '$lib/assets/clown_by_Jacob.png';
</script>

<section class="error-page">
	{#if page.status === 404}
		<h1>Такой страницы нет</h1>
		<p>Похоже, вы заблудились. Попробуйте вернуться на главную страницу.</p>
	{:else}
		<p>Упс! Что-то пошло не так. Попробуйте обновить страницу или вернуться позже.</p>
		<h4>{page.error?.message}</h4>
	{/if}

	<img src={NotFoundImage} alt="Здесь ничего нет, как и актива на этом сайте. Made by Jacob." />
</section>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem;
	}
</style>
