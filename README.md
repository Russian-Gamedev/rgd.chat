# rgd.chat

## Developing

Once you've created a project and installed dependencies with `pnpm i`, start a development server:

> We using _[pnpm](https://github.com/pnpm/pnpm)_ for development

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To build production run:

```bash
pnpm build
```

> You can preview the built app with `pnpm preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
