<script>
	import NotFoundImage from '$lib/assets/clown_by_Jacob.png';
</script>

<main>
	<h1>Такой страницы не нет</h1>
	<p>Похоже, вы заблудились. Попробуйте вернуться на главную страницу.</p>
	<img src={NotFoundImage} alt="Здесь ничего нет, как и актива на этом сайте. Made by Jacob." />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem;
	}
</style>
