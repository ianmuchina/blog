#!/bin/bash

# TODO: Check if programs are installed

cd public || exit

# For each jpeg image
for i in *.jpg; do
    SRC="$i"
    DEST="../static/${i%.*}"

    # Convert to webp
    if [ ! -f "$DEST.webp" ]; then
        convert "$SRC" "$DEST.webp"
    fi

    # Convert to avif
    if [ ! -f "$DEST.avif" ]; then
        convert "$SRC" "$DEST.avif"
    fi
done
