#!/bin/bash



checkYesNo() { 
local questionInput="$1 Do you want to proceed? y/n "
read -n 1 -p "$questionInput" yn
case $yn in 
    [yY]) echo "ok, I will proceed."
        return 1;;
    [nN]) echo "ok, I won't proceed."
        return 2;;
    
    *)
        echo 'Invalid choice, answer Y or N or y or n'
        return 3;;
esac
}

# question="$1"

# result=$(checkYesNo "$question")

# echo " The return value is: $?"
# echo "$result"




 
