#!/bin/bash
[ "$ENVIRONMENT" == "dev" ] && export ARGS="-D"
rm public/ -fr
rm resources/_gen/ -fr 
yarn install
yarn hugo $ARGS