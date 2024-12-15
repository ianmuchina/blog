build:
	yarn hugo -D

img: build
	./scripts/gen_variants.sh

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

# Hashflags
hf:
	wget -O data/campaigns.json https://ianmuchina.github.io/HashflagArchive/data/campaigns.json
	wget -O data/hashtags.json https://ianmuchina.github.io/HashflagArchive/data/hashtags.json
