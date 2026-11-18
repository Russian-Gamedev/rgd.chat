import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig, type Plugin } from 'vite';

import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// adapter-cloudflare's workerd emulation overrides environments.ssr.optimizeDeps.exclude,
// which makes Vite prebundle @sveltejs/kit and creates a second Redirect class — breaking
// redirect() during load in dev. Re-add kit's excludes for the ssr environment.
function fixSsrOptimizeDeps(): Plugin {
	return {
		name: 'fix-ssr-optimize-deps',
		enforce: 'post',
		config(config) {
			config.environments ??= {};
			config.environments.ssr ??= {};
			config.environments.ssr.optimizeDeps ??= {};
			config.environments.ssr.optimizeDeps.exclude = [
				...new Set([
					...(config.environments.ssr.optimizeDeps.exclude ?? []),
					'@sveltejs/kit',
					'$app',
					'$env'
				])
			];
			// eagerly prebundle the dep that otherwise triggers a lazy re-optimization
			// mid-first-request, which breaks async SSR of <svelte:head> on cold start
			config.environments.ssr.optimizeDeps.include = [
				...new Set([
					...(config.environments.ssr.optimizeDeps.include ?? []),
					'@floating-ui/dom',
					'svelte-meta-tags'
				])
			];
		}
	};
}

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: [vitePreprocess(), mdsvex()],
			extensions: ['.svelte', '.svx'],
			adapter: adapter()
		}),
		fixSsrOptimizeDeps()
	],
	server: {
		host: '0.0.0.0',
		port: 5173,
		allowedHosts: true,
		strictPort: true
	}
});
