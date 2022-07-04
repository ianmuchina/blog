#!/bin/bash
[ "$ENVIRONMENT" == "prod" ] && npm run build || npm run build-drafts