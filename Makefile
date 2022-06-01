build:
	yarn hugo -D

img: build
	./scripts/gen_variants.sh

update:
	yarn hugo mod get -u
	yarn hugo mod tidy

ci-build:
	./scripts/build.sh

clean:
	rm 'resources/filecache/getresource/15902302297382621871'

fmt:
	yarn prettier -w .

fmt-check:
	yarn prettier --check .

lint:
	yarn stylelint "**/*.scss"
