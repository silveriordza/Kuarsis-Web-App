#!/bin/bash

echo 'This command is used to force to replace local changes with the remote branch changes' 
echo 'This is used as last resource if the git pull, or git fetch and git merge are not upading the local branch with the latest changes that exist in the remote branch.'
echo 'Be careful running this command since it will reverse any uncommited changes, and will remove any untracked files and folders from your local branch and cannot be RECOMVERED'
read -p "Are you sure you want to proceed? y/n " yn
case $yn in 
    [yY]) echo "ok, I will proceed"
        ;;
    [nN]) echo "ok, glad we checked. Exiting"
        exit;
        ;;
    *)
        echo 'Invalid choice, answer Y or N or y or n'
        ;;
esac

read -p "What is the name of the remote branch you want to force pull and replace local branch? " remoteBranchName

#This command will checkout (or revert) the files to the state in the last commit. This will discard all changes made in the current directory.
git checkout .
#This command will remove untracked files from the working directory of the Git repository. 
#f will remove untracked files
#d will remove untracked directories
#note: removal of untracked files is irreversible, make sure you really want to run this command. 
git clean -fd
#Hard reset the local branch to point to the latest commit of the remote Branch.
git reset --hard origin/$remoteBranchName
#Pull and merge the remote branch into the local branch.
git pull origin $remoteBranchName




 
