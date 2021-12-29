const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		colors: {
			primary: '#5C87E7',
			general: '#fefefe',
			body: '#999ca0',
			link: '#005BD1',
			linkVisited: '#528FDF',

			gold: '#DEAB43',
			silver: '#9FA7AB',
			bronze: '#DE9C65',
			success: '#0DC268',
			notify: '#FF9E00',
			error: '#ED0A34',
			live: '#ED1111',
			white: '#FFFFFF',

			// Background colors
			midnight: '#1B1C1F',
			black: '#111215',
			control: '#212226',
		},
		fontFamily: {
			sans: ['Mulish', 'Inter', 'Roboto', '"Noto Sans"', '"Open Sans"', '"Helvetica Neue"', '"Segoe UI"',
				'BlinkMacSystemFont', '-apple-system', 'Cantarell', 'Arial', 'sans-serif']
		},
		fontSize: {
			badge: ['0.625rem', {
				letterSpacing: '.03125rem',
				lineHeight: '1rem',
			}],
			card: ['0.875rem', {
				lineHeight: '1.5rem',
			}],
			navigation: ['0.9375rem', {
				lineHeight: '1.25rem',
			}],
			base: ['1.25rem', {
				lineHeight: '1.625rem',
			}],
			lg: ['1.25rem', {
				lineHeight: '1.75rem',
			}],
			lx: ['1.5rem', {
				lineHeight: '2rem',
			}],
			mega: ['2rem', {
				lineHeight: '2.5rem',
			}],
		},
		extend: {
			width: {
				'69': '17.25rem', // это не шутка, 17.25rem это и есть 69 в частях tailwind
			}
		},
	},

	plugins: [],
};

module.exports = config;
