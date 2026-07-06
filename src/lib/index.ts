// place files you want to import through the `$lib` alias in this folder.

export type Colors = 'primary' | 'success' | 'error' | 'warning' | 'bg-surface' | 'bg';

declare global {
	interface ImportMetaEnv {
		VITE_API_TARGET_URL: string;
		VITE_AUTH_URL: string;
		VITE_EMBED_URL: string;
	}
}
