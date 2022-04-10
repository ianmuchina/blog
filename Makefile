build:
	hugo -D

img: build
	./scripts/gen_variants.sh

update:
	hugo mod get -u
	hugo mod tidy