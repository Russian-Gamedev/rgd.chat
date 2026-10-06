import type { ProjectType } from '$lib/api/api.type';

export const PROJECT_TYPES = [
	'game',
	'service',
	'tool',
	'other'
] as const satisfies readonly ProjectType[];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
	game: 'Игра',
	service: 'Сервис',
	tool: 'Инструмент',
	other: 'Другое'
};

export const PROJECT_TYPE_OPTIONS = PROJECT_TYPES.map((value) => ({
	value,
	label: PROJECT_TYPE_LABELS[value]
}));

export function toProjectType(value: string | null | undefined): ProjectType | undefined {
	return (PROJECT_TYPES as readonly string[]).includes(value ?? '')
		? (value as ProjectType)
		: undefined;
}
