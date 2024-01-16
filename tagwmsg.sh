#!/bin/bash
# $1 is the version number like 1.0.0.0
# $2 is the comment for the tag
branchName=$(git branch --show-current)
tagName="tag$branchName-v$1"
git tag -a $tagName -m "$2"
 