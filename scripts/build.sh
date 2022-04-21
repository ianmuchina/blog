#!/bin/bash
# Install latest hugo binary from npm
npm install hugo-extended

if [ "$ENVIRONMENT" == "dev" ]; then
    "$(npm bin)"/hugo -D
else
    "$(npm bin)"/hugo
fi
