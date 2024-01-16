#!/bin/bash
git add .
git commit -m 'Intermediate commit to backup local changes'
localBranchName=$(git branch --show-current)
git push origin $localBranchName
 