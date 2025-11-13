<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/globals.css';

	const title = 'Russian Gamedev — Discord сообщество';
	const description =
		'Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих игр и идей, найдёте отличных напарников которые не бросят под самый релиз, и живой войс где мы регулярно срём новых участников и играем в игры.';

	const metadata = {
		title,
		description,
		keywords: ['gamedev', 'game development', 'discord', 'russian gamedev', 'разработка игр'],
		openGraph: {
			title,
			description,
			type: 'website',
			url: 'https://rgd.chat',
			siteName: 'rgd.chat',
			images: 'https://assets.rgd.chat/banner.jpg',
			locale: 'ru_RU'
		},
		authors: { name: 'Russian Gamedev', url: 'https://rgd.chat' },
		themeColor: '#5c87e7'
	};

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content={metadata.themeColor} />
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />
	<meta name="keywords" content={metadata.keywords.join(', ')} />
	<meta name="author" content="Russian Gamedev" />
	<link rel="canonical" href={metadata.openGraph.url} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={metadata.openGraph.type} />
	<meta property="og:url" content={metadata.openGraph.url} />
	<meta property="og:title" content={metadata.openGraph.title} />
	<meta property="og:description" content={metadata.openGraph.description} />
	<meta property="og:image" content={metadata.openGraph.images} />
	<meta property="og:image:alt" content={metadata.openGraph.title} />
	<meta property="og:site_name" content={metadata.openGraph.siteName} />
	<meta property="og:locale" content={metadata.openGraph.locale} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={metadata.openGraph.url} />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />
	<meta name="twitter:image" content={metadata.openGraph.images} />
	<meta name="twitter:image:alt" content={metadata.title} />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="language" content="Russian" />
</svelte:head>

<main>
	{@render children()}
</main>

<style>
	main {
		max-width: 800px;
		padding: 64px 40px;
	}
</style>
