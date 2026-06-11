import { mdsvex } from 'mdsvex';

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			handleHttpError: ({ path, status, message }) => {
				const pendingRoutes = new Set(['/games', '/jams', '/blogs', '/donators']);
				if (status === 404 && pendingRoutes.has(path)) return;

				throw new Error(message);
			}
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
