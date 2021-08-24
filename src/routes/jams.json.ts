import { jams } from '$lib/jams';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
  return {
    body: jams
  };
}