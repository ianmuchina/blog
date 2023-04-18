#!/bin/bash
# Find all uses of the tweet component
rg '\{\{<tweet' content/* |
    # Filter out the id field 
    grep -o "id=\".[0-9]*"\" |
    # Get the actual id
    cut -f2 -d "=" |
    # Remove duplicates
    sort -u
