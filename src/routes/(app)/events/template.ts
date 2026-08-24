const TEMPLATE_PARAM_REGEX = /\$\{(\w+)\}/g;

export function renderTemplate(template: string, params: Record<string, string>) {
	return template.replace(TEMPLATE_PARAM_REGEX, (match, name) =>
		name in params ? params[name] : match
	);
}

export function extractTemplateParams(template: string) {
	return [...new Set([...template.matchAll(TEMPLATE_PARAM_REGEX)].map((match) => match[1]))];
}
