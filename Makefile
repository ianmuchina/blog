tw: tailwind
tailwind:
	pnpm exec tailwindcss -o ./assets/css/tailwind.css

tw-w: tailwind-w 
tailwind-w:
	pnpm exec tailwindcss -o ./assets/css/tailwind.css -w

build: tailwind dist purify

dev:
	hugo server

install:
	pnpm install

dist:
	hugo --minify

# remove unused styles
purify:
	pnpm exec purifycss public/css/main.css public/**/**.html -o public/css/main.css -i 