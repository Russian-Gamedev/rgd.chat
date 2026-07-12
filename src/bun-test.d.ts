declare module 'bun:test' {
	type Matcher = {
		toBe(expected: unknown): void;
		toEqual(expected: unknown): void;
		toMatchObject(expected: unknown): void;
		toBeDefined(): void;
		toBeUndefined(): void;
		toBeTrue(): void;
		toBeFalse(): void;
		toBeNull(): void;
		not: Matcher;
	};

	export function describe(name: string, callback: () => void): void;
	export function test(name: string, callback: () => void | Promise<void>): void;
	export function expect(value: unknown): Matcher;
}
