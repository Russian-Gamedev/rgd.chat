import HeadingID from "remark-heading-id";

const config = {
	extensions: [".svelte.md", ".md", ".svx"],

	smartypants: {
		dashes: "oldschool",
	},

	remarkPlugins: [HeadingID],
	rehypePlugins: [],
};

export default config;
