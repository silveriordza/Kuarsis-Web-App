#!/bin/bash
#echo "I'm about to add commit push commit tag and push tag with comments."
source checkYesNo.sh 

question="We are about to release, commit tag code into git."

#The below is the way to call a function from the bash checkYesNo.sh file passing a parameter.
#Remeber to enclose the parameter in "" otherwise it may cause problems when reading the parameter when spaces are in the text. 
result=$(checkYesNo "$question")
returnedValue=$?
echo " The return value is: $returnedValue"


if [ "$returnedValue" -ge 2 ]; then
echo "$result"
# If you use exit 1 to stop the execution, the whole terminal will close.
#exit 1
# If you want the bash to stop execution without exiting terminal just do a return. The return value can be read with $?
return 1
fi

tagVersion="$1"
comment="$2"


git add .
git commit -m 'Intermediate commit to backup local changes'

source commitwmsh.sh
# localBranchName=$(git branch --show-current)
# git push origin $localBranchName
 