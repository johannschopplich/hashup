# hashup

> ℹ️ Mainly to use in conjunciton with [kirby-hashed-assets](https://github.com/johannschopplich/kirby-hashed-assets).

`hashup` is a tiny CLI tool with two objectives in mind for your freshly built frontend assets:

1. Rename or rather hash (hence the name) the assets.
2. Generate a `manifest.json` for them.

## Installation

```bash
npm i hashup -D
```

## Usage

Add hashup to your build pipeline by adding it your `package.json` scripts (recommended), for example:

```js
{
  "scripts": {
    "clean": "rm -rf public/assets/{css,js}",
    "build": "npm run clean && <...> && hashup"
  },
  "devDependencies": {
    "hashup": "latest"
  }
}
```

Now, pass asset paths to Kirby's asset helpers like you normally do:

```php
<?= js('assets/js/main.js') ?>
// `<script src="https://example.com/assets/js/main.9ad649fd.js"></script>
```

Read on here: [Automatic hashing with `manifest.json`](https://github.com/johannschopplich/kirby-hashed-assets#automatic-hashing-with-manifestjson).

## License

[MIT](./LICENSE) License © 2021 [Johann Schopplich](https://github.com/johannschopplich)
