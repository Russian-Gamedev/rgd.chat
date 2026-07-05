import { sveltekit } from '@sveltejs/kit/vite';
import { svelteSitemap } from 'svelte-sitemap/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '');
	return {
		plugins: [sveltekit(), svelteSitemap({ domain: 'https://rgd.chat' })],
		server: {
			host: '0.0.0.0',
			port: 5173,
			allowedHosts: true,
			strictPort: true,
			proxy: {
				'/api': {
					target: env.VITE_API_TARGET_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		}
	};
});
