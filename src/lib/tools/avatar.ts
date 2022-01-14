export function userAvatar(user: any, size: number = 64): string {
	if (user.avatar_url) {
		let avatar = new URL(user.avatar_url);
		avatar.searchParams.set("size", size.toString());
		return avatar.toString();
	} else if (user.id) {
		// It's definitely not right, but I dont give a fuck
		return `https://cdn.discordapp.com/embed/avatars/${+user.id % 5
			}.png?size=${+size}`;
	} else {
		return `https://cdn.discordapp.com/embed/avatars/${user.username.charCodeAt(0) % 5
			}.png?size=${+size}`;
	}
}
