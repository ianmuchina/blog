build:
	hugo -D

img: build
	./scripts/gen_variants.sh

update:
	hugo mod get -u
	hugo mod tidy

ci-build:
	[ "$ENVIRONMENT" == "dev" ] && export ARGS="-D"
	npm install hugo-extended && $(npm bin)/hugo $ARGS