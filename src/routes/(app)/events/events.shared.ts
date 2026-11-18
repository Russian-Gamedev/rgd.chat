import type { GuildEventName } from '#lib/api/api.type';

export const eventNames: Record<GuildEventName, string> = {
	member_first_join: 'Первое вступление',
	member_join: 'Вступление на сервер',
	member_leave: 'Выход с сервера',
	member_ban: 'Бан',
	member_kick: 'Кик',
	member_set_name: 'Смена ника',
	activity_raffle: 'Ежедневный дроп'
};

export const eventParams: Record<GuildEventName, string[]> = {
	member_first_join: ['user'],
	member_join: ['user'],
	member_leave: ['user'],
	member_ban: ['user', 'moderator'],
	member_kick: ['user', 'moderator'],
	member_set_name: ['user', 'nickname'],
	activity_raffle: ['user', 'money']
};

export function isGuildEventName(value: string): value is GuildEventName {
	return value in eventNames;
}

/** Собирает сниппет вида `${name}` без literal-плейсхолдера в строке. */
const token = (body: string) => `\${${body}}`;

/** Динамические токены, доступные в шаблонах любых событий. */
export const dynamicTokens: { snippet: string; hint: string }[] = [
	{
		snippet: token('active'),
		hint: 'Случайный участник с ролью «активный»'
	},
	{
		snippet: token('irandom,1,10'),
		hint: 'Случайное целое число от 1 до 10 (границы любые)'
	},
	{
		snippet: token('choose,вариант 1,вариант 2'),
		hint: 'Один из перечисленных вариантов через запятую'
	}
];
