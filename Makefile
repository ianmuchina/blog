build:
	hugo -D

img: build
	./scripts/gen_variants.sh