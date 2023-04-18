# Blog

Personal Blog. Built with hugo.

## Directorty structure

- [`content/*`](/content) - Posts in Markdown
- [`layouts/*`](/layouts) - Layout templates.
- [`resources/*`](/resources/) - Cached data

## Requirements

- Go 1.11 or later
- Hugo extended version

## Tools used

- [hugo](https://github.com/gohugoio/hugo) Static site generator.
- [hugo-extended](https://www.npmjs.com/package/hugo-extended) manage
  hugo-extended versions via using npm
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting
- [pnpm](https://pnpm.io/) - npm package manager. Faster than npm & yarn
- [prettier](https://prettier.io/) - An opinionated code formatter
- [prettier-plugin-go-template](https://github.com/NiklasPor/prettier-plugin-go-template) -
  Formatting for go templates
- [stylelint](https://github.com/stylelint/stylelint) CSS Linting
- [stylelint-config-standard-scss]() SCSS support for stylelint

## Notes

Run `make clean` when adding new tweets to reset the guest-token.
Run `hugo --gc` to delete unused cache data