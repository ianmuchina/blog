#!/bin/bash
[ "$ENVIRONMENT" == "prod" ] && npm run build
[ "$ENVIRONMENT" == "dev" ] && npm run build-drafts