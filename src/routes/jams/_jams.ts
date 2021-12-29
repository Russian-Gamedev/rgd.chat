const assets = import.meta.glob('../../jams/**/*.{png,jpg,gif}');
const assetMap: Record<string, Record<string, string>> = {};
Object.entries(assets).forEach(
	([filepath, asset]) => {
		const path = filepath.split('/').slice(3)
		const slug = path[0]
		asset().then(assetPath => {
			if (!assetMap[slug]) assetMap[slug] = {}
			const name = path.slice(1).join('/')
			assetMap[slug][name] = assetPath.default
		})
	}
)

const modules = import.meta.globEager('../../jams/**/*.md')
export const jams = Object.entries(modules).map(
	([filepath, module]) => {
		const slug = filepath.split('/')[3]
		const { metadata } = module

		// Figuring out image paths
		metadata?.games?.map((game) => {
			if (!game.image) return
			if (assetMap[slug]) {
				game.image = assetMap[slug][game.image]
			}
		})

		// Sorting games
		metadata?.games?.sort((a, b) => {
			const ao = !!a.order;
			const bo = !!b.order;

			if (!ao && !bo) {
				return 0;
			}

			if (ao && !bo) {
				return -1;
			}

			if (!ao && bo) {
				return 1;
			}

			if (ao && bo) {
				return a.order - b.order;
			}
		});

		const { html } = module.default.render()
		return {
			slug,
			html,
			...metadata,
		}
	}
).sort((a, b) => a.start - b.start)
