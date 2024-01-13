echo 'First remove files from git cache if they were already added' 
git rm --cache ./amplify/.config/project-config.json
git rm --cache ./amplify/README.md
git rm --cache ./amplify/backend/api/kuarxbedevAPI/cli-inputs.json
git rm --cache ./amplify/backend/function/kuarxbedevFunction/amplify.state
git rm --cache ./amplify/backend/function/kuarxbedevFunction/custom-policies.json
git rm --cache ./amplify/backend/function/kuarxbedevFunction/parameters.json
git rm --cache ./amplify/backend/tags.json
git rm --cache ./amplify/backend/types/amplify-dependent-resources-ref.d.ts
git rm --cache ./amplify/cli.json
git rm --cache ./amplify/hooks/README.md
echo 'Finished removing files from tracking'
echo 'Next step is manual: run "git add ." and then "git commit -m " to make the removal effective.'
echo 'Last manual step: add the paths and files to .gitignore using **/amplify/.config/project-config.json  for example, then add and commit the gitignore also'


