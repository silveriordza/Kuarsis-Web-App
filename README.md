Kuarsis Web App is the code for the official website of Kuarsis Companies.
Author: Silverio Rodriguez Alcorta
Kuarsis Owner CEO, CTO: Silverio Rodriguez Alcorta
Application Description: This is the backend all Web Front End Kuarxis applications are sharing. 
Date: 5/26/23

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-v1.0.0.3
Version date: 5/30/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added the isShippable flag to the products model in mongo DB, also updated all related productController functions to take the flag into account. 
2.- Added a LogThis function into the Logger.js file in the utils folder. This function will log a user provided message into the console.log only when the LOG_LEVEL environment variable is equal or greater to 1, this value can be set in the .env file and it also has to be added as an ENVIRONMENT variable in the cloud Lambda Function.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-v1.0.0.2
Version date: 5/28/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Updated orderController to enable sending back the OrderList based on a user id, back to the calling client.
2.- Updated the userRoutes to enable the token protection for getting list of Users of the application that is only displayed when the caller user has the Admin flag set to true, only admin users have access to see all users registered into the application.  


//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v1.0.0.1-back-dev
Version date: 5/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added new logic to remove secrets from .env files and environment variables,  to avoid exposing this secrets when commiting to github. Added secret values to AWS SSM Parameters Store using amplify function update, option update secrets, then added logic into the NodeJs App.js file to get secrets using SSM.getParameters. Also updated the environment variables to remove secrets into the Lambda function environment variables configurations. 
2.- Removed the AWSConfig.js file since all process.env variables are now accessed directly and not thrugout AWSConfig.js.


