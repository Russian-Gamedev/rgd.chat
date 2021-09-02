<script lang="ts">
	export let role: string;
	export let title: string;
	export let teaser: string = '';
	export let image: string = '/placeholders/banner.jpg';
	export let imageAlt: string = '';
	export let imageBGColor: string = '#648ce8';
	export let buttonText: string = 'Подробнее';
	export let href: string;
	export let rel: string = '';
</script>

<div {role} class="banner">
	<!-- Also, maybe wrap it into `figure` for semantics? -->
	<img src={image} alt={imageAlt} style={`background-color: ${imageBGColor};`} />
	<div class="content">
		<div class="info">
			<h1 class="title">{title}</h1>
			<p class="teaser">
				<slot>{teaser}</slot>
			</p>
		</div>
		<a class="link" {href} {rel}> {buttonText} </a>
	</div>
</div>

<style lang="scss">
	.banner {
		align-self: stretch;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		border-radius: 0.4rem;
		padding: 0.8rem;
		overflow: hidden;
		text-decoration: none;
		background-color: var(--secondary-background);

		img {
			margin: 0;
			object-fit: cover;
			width: 100%;
			aspect-ratio: 3 / 1;
			border-radius: 0.2rem;
			background: #648ce8;
		}

		.content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 2rem;

			.info {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;

				.title,
				.teaser {
					line-height: 1.2rem;
					margin: 0;
				}

				.title {
					font-size: 0.7rem;
					font-weight: 700;
				}

				.teaser {
					font-size: 0.7rem;
					color: var(--dimmed-text-gen-text);
				}
			}

			.link {
				display: flex;
				align-items: center;
				padding: 0.4rem 0.6rem 0.4rem 0.8rem;
				background-color: var(--primary);
				border-radius: 0.4rem;
				font-size: 0.85rem;
				font-weight: 700;
				line-height: 1.2rem;
				color: var(--pure-white);

				&:hover {
					text-decoration: none;
				}

				&::after {
					margin-left: 0.4rem;
					width: 1.2rem;
					height: 1.2rem;
					content: url('/icons/chevron-right.svg');
				}
			}
		}
	}
</style>
