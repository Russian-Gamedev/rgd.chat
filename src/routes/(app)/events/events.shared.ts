import type { GuildEventName } from '$lib/api/api.type';

export const eventNames: Record<GuildEventName, string> = {
	member_first_join: 'Первое вступление',
	member_join: 'Вступление на сервер',
	member_leave: 'Выход с сервера',
	member_ban: 'Бан',
	member_kick: 'Кик',
	member_set_name: 'Смена ника'
};

export function isGuildEventName(value: string): value is GuildEventName {
	return value in eventNames;
}
