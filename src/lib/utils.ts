export function defaultAvatar(discriminator: string | number, size: string | number = 64): string {
	return `https://cdn.discordapp.com/embed/avatars/${+discriminator % 5}.png?size=${+size}`
}
