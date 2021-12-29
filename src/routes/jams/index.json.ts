import { jams } from './_jams'

export async function get() {
	return {
		body: { jams: jams },
	}
}
