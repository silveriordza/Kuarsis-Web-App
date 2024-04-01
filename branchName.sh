#!/bin/bash
#This command will display the name of the current branch.
result=$(git branch --show-current)
echo 'The name of the branch you are is' $result ' branch'