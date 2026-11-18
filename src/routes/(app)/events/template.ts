/** Matches a well-formed placeholder: `${name}` or `${name,arg,...}`. */
const TEMPLATE_TOKEN_REGEX = /\$\{([^{},]+(?:\s*,\s*[^{},]+)*)\}/g;
/** Matches any `${...}` shape, including malformed ones, for validation. */
const PLACEHOLDER_REGEX = /\$\{([^{}]*)\}/g;

type TemplateToken = {
	/** Argument count bounds after the token name. */
	minArgs: number;
	maxArgs: number;
	/** Ошибка для невалидных аргументов или null, когда всё в порядке. */
	validateArgs?: (args: string[]) => string | null;
	/** Рендер для предпросмотра; у `active` отсутствует — токен остаётся как есть. */
	render?: (args: string[]) => string;
};

/** Зеркало реестра токенов бота (guild-events.tokens.ts). */
const TEMPLATE_TOKENS: Record<string, TemplateToken> = {
	active: { minArgs: 0, maxArgs: 0 },
	irandom: {
		minArgs: 2,
		maxArgs: 2,
		validateArgs: ([min, max]) =>
			!/^-?\d+$/.test(min) || !/^-?\d+$/.test(max)
				? 'ожидает два целых числа'
				: Number(min) > Number(max)
					? 'ожидает min ≤ max'
					: null,
		render: ([min, max]) => String(randomInt(Number(min), Number(max)))
	},
	choose: {
		minArgs: 1,
		maxArgs: Number.POSITIVE_INFINITY,
		render: (args) => {
			const arg = args[Math.floor(Math.random() * args.length)];
			return arg ?? '';
		}
	}
};

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function splitTokenBody(body: string): string[] {
	return body.split(',').map((part) => part.trim());
}

export function renderTemplate(template: string, params: Record<string, string>) {
	return template.replace(TEMPLATE_TOKEN_REGEX, (match, body: string) => {
		const [name, ...args] = splitTokenBody(body);
		const token = TEMPLATE_TOKENS[name];

		if (token && args.length >= token.minArgs && args.length <= token.maxArgs) {
			if (token.validateArgs?.(args)) return match;
			if (token.render) return token.render(args);
		}

		return args.length === 0 && name in params ? (params[name] ?? match) : match;
	});
}

/** Возвращает имена только обычных параметров, без динамических токенов. */
export function extractTemplateParams(template: string) {
	const names = new Set<string>();
	for (const [, body] of template.matchAll(TEMPLATE_TOKEN_REGEX)) {
		const [name, ...args] = splitTokenBody(body);
		if (!(name in TEMPLATE_TOKENS) && args.length === 0) names.add(name);
	}
	return [...names];
}

/** Проверяет синтаксис плейсхолдеров и обязательные параметры; пустой список — всё хорошо. */
export function validateTemplate(template: string, requiredParams: string[]) {
	const problems: string[] = [];
	const presentParams = new Set<string>();

	for (const [match, body] of template.matchAll(PLACEHOLDER_REGEX)) {
		const parts = splitTokenBody(body);
		const [name, ...args] = parts;

		if (parts.some((part) => part === '') || !/^\w+$/.test(name)) {
			problems.push(`некорректный плейсхолдер: ${match}`);
			continue;
		}

		const token = TEMPLATE_TOKENS[name];
		if (token) {
			if (args.length < token.minArgs || args.length > token.maxArgs) {
				problems.push(`неверное число аргументов: ${match}`);
			} else {
				const error = token.validateArgs?.(args);
				if (error) problems.push(`${match} ${error}`);
			}
			continue;
		}

		if (args.length > 0) {
			problems.push(`неизвестный токен: ${match}`);
			continue;
		}
		presentParams.add(name);
	}

	for (const param of requiredParams) {
		if (!presentParams.has(param)) {
			problems.push(`нет обязательного параметра: \${${param}}`);
		}
	}

	return problems;
}
