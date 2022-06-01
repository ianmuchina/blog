#!/bin/bash
[ "$ENVIRONMENT" == "dev" ] && export ARGS="-D"
rm public/ -fr
rm resources/_gen/ -fr
npm install
"$(npm bin)"/hugo $ARGS