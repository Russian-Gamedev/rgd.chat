import { jams } from './_jams'

export async function get(req) {
	const { slug } = req.params

	const jam = jams.find(jam => jam.slug === slug)

	return {
		body: { jam },
	}
}
