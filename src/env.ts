import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	API_ORIGIN: {
		public: false,
		schema: (input) => input || 'https://bot.rgd.chat'
	}
});
