import { browser } from '$app/environment';

export type SnackbarVariant = 'default' | 'success' | 'error' | 'warning';

export type SnackbarItem = {
	id: string;
	message: string;
	variant: SnackbarVariant;
	createdAt: number;
	duration: number;
};

export type ShowSnackbarOptions = {
	message: string;
	variant?: SnackbarVariant;
	duration?: number;
};

const DEFAULT_SNACKBAR_DURATION = 4000;
const MAX_VISIBLE_SNACKBARS = 5;

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const snackbars = $state<SnackbarItem[]>([]);

function removeSnackbar(id: string) {
	const index = snackbars.findIndex((snackbar) => snackbar.id === id);

	if (index === -1) {
		return;
	}

	snackbars.splice(index, 1);
}

function clearSnackbarTimer(id: string) {
	const timer = timers.get(id);

	if (!timer) {
		return;
	}

	clearTimeout(timer);
	timers.delete(id);
}

function scheduleSnackbarDismiss(id: string, duration: number) {
	if (!browser || duration <= 0) {
		return;
	}

	const timer = setTimeout(() => {
		dismissSnackbar(id);
	}, duration);

	timers.set(id, timer);
}

function createSnackbarId() {
	if (browser && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	return `snackbar-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function showSnackbar(options: ShowSnackbarOptions) {
	const snackbar: SnackbarItem = {
		id: createSnackbarId(),
		message: options.message,
		variant: options.variant ?? 'default',
		createdAt: Date.now(),
		duration: options.duration ?? DEFAULT_SNACKBAR_DURATION
	};

	snackbars.unshift(snackbar);

	while (snackbars.length > MAX_VISIBLE_SNACKBARS) {
		const removed = snackbars.pop();

		if (removed) {
			clearSnackbarTimer(removed.id);
		}
	}

	scheduleSnackbarDismiss(snackbar.id, snackbar.duration);

	return snackbar.id;
}

export function dismissSnackbar(id: string) {
	clearSnackbarTimer(id);
	removeSnackbar(id);
}

export function clearSnackbars() {
	for (const id of timers.keys()) {
		clearSnackbarTimer(id);
	}

	snackbars.splice(0, snackbars.length);
}
