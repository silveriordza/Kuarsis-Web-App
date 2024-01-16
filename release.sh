#!/bin/bash
#echo "I'm about to add commit push commit tag and push tag with comments."
source checkYesNo.sh 

question="We are about to release, commit tag code into git."

result=$(checkYesNo "$question")
returnedValue=$?
echo " The return value is: $returnedValue"


if [ "$returnedValue" -ge 2 ]; then
echo "$result"
# echo "no y"
return 1
fi

# echo "Process not exited"

# git add .
# git commit -m 'Intermediate commig to backup local changes'
# localBranchName=$(git branch --show-current)
# git push origin $localBranchName
 