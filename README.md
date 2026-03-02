# PDF Processing UI

Quick small front-end for running processing tasks on PDF files via api's.
Has queues, (faked) progress bars, quality options and authentication with bearer tokens.
Originally set up to use [PDF Ghostpress](https://hub.docker.com/r/blackbirdapp/pdf-ghostpress) but probably could work with other backends.

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```
