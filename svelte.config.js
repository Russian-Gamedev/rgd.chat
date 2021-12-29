import mdsvexConfig from "./mdsvex.config.js";
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({}), mdsvex(mdsvexConfig)],

  kit: {
    adapter: adapter(),
    target: "#biba",
  },

  plugins: [mdsvex],
};

export default config;
