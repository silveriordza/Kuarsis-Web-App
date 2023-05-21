Kuarsis Web App is the code for the official website of Kuarsis Companies.
Author: Silverio Rodriguez Alcorta
Kuarsis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version kuarxbedev-1.0.0.0
Version Description: This is the backend code for Kuarxis applications.
Date: 5/20/23

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-1.0.0.0
Version date: 5/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Prior to this version, each Kuarsis application (kuarsis.com, dev.kuarsis.com, pixandev.kuarsis.com and pixan.kuarsis.com) had it sown backend and frontend environment, resulting in 8 different environments to maintain. Also, each application frontend and backend were sharing the same git branch. The backend code was the same for all applications therefore it did not make sense to have different environments to host exactly the same code, this caused inneficiencies when the backend code changed for one application, it has to be merged to each and every other application git branches and also pushed and published to each and every AWS Amplify environment in the Cloud, which was very time consuming.
2.- Given the problem above, we designed a solution to separate the backend from the frontend locally and in AWS Amplify. AWS Amplify does not support multiple hosting (frontend) applications on the same environment, reason why new enviornments were created for each front end and the backend was removed from each,  and only one backend environment was created to host only the backend there which is then shared across all frontend environments. 
3.- This branch kuarxbedev will contain the kuaxis backend only. It can later be used on a separate folder just for backend, clone the Kuarsis-Web-App repository, and fetch the kuarxbedev branch only into your local directory, you will have the backend that can be run separately from the front end.  

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: 1.0.0.0-dev
Version date: 5/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added new logic to remove secrets from .env files and environment variables,  to avoid exposing this secrets when commiting to github. Added secret values to AWS SSM Parameters Store using amplify function update, option update secrets, then added logic into the NodeJs App.js file to get secrets using SSM.getParameters. Also updated the environment variables to remove secrets into the Lambda function environment variables configurations. 
2.- Removed the AWSConfig.js file since all process.env variables are now accessed directly and not thrugout AWSConfig.js.


