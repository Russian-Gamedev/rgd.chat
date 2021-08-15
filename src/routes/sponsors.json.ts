import sponsors from '$lib/sponsors';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
  return {
    body: sponsors
  };
}