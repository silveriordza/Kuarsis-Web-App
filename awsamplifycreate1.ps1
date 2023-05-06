# Write-Host 'Installing aws amplify cli'
# Read-Host -Prompt 'Pause, type enter'
# npm install -g @aws-amplify/cli
Write-Host 'configuring amplify'
Read-Host -Prompt 'Pause, type enter'
amplify configure
Write-Host 'Initialize the Project with amplify init'
amplify init
Write-Host 'Add a Lambda function to the project'
amplify add function
Write-Host 'You can look at the generated Lambda code now and modify it at will, I will wait...'
Read-Host -Prompt 'Press enter to continue...'
Write-Host 'After modifying the code, next step is Build the code, which will go into that directory and do an npm install'
amplify function build
Write-Host 'Now you can test the function locally with amplify mock function, make sure to go to the funciton folder and run the mock from there'
#amplify mock function lambdaFunction
Write-Host 'Take a moment to see the mock test results.'
Read-Host -Prompt 'Press enter to continue...'
Write-Host 'Create an endpoint in the AWS cloud for hosting this funciton with aplify add api, make sure to select REST, and existent Lambda function you just created above'
amplify add api
Write-Host 'Check the API has been added locally:'
amplify status
Read-Host -Prompt 'Press enter to continue...'
Write-Host 'Now push the local stuff to the AWS Cloud with amplify push'
amplify push
Write-Host 'Add an Express application with amplify add function expressServerExample'
amplify add function
Write-Host 'Now you can modify the code of that in the index.js and app.js of that lambda function. I will wait...'
Read-Host -Prompt 'Press enter to continue...'
Write-Host 'Now save your code and you can do an Update of the API with amplify update api, make sure to select Add Another path, to add a new path for the Express app'
amplify update api
Write-Host 'Go to the Express App.js and modify code as needed, I will wait...'
Read-Host -Prompt 'Press enter to continue...'
Write-Host 'Once you are done modifying code, save it and then push it to the Cloud'
amplify push




















