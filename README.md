Kuarsis Web App is the code for the official website of Kuarsis Companies.
Author: Silverio Rodriguez Alcorta
Kuarsis Owner CEO, CTO: Silverio Rodriguez Alcorta
Application Description: This is the backend all Web Front End Kuarxis applications are sharing. 

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-v1.0.0.5
Version date: 6/26/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- productCotroller, getProducts function: Added the a call to the function .lean() of mongoose to make sure the JSON returns a list of javascript native objects rather than mongoose objects, whicih may cause problems when calling to functions on the object returned to the front end. 

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-v1.0.0.4
Version date: 6/19/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Into the Products and Orders tables: added product types flags for shippable, downloadable, bookable, and image protected.
2.- Added a LogThis function into the Logger.js file in the utils folder. This function will log a user provided message into the console.log only when the LOG_LEVEL constant is equal or greater to 1, this value can be set with an environment variable LOG_LEVEL.
3.- Added information into the Users table to store the  address information (address, internal number, city, state, postal code, country) to support the User Registration process and the User Profile, User Registration, User Details Admin screens in the front end. 
4.- Added logic into the GetOrderDetailsById function to return flags shippable, downloadable, bookable and image protected.
5.- Added a new API Path named Configs and its corresponding configsRoutes, configsController, configs model in mongoose, and also the logic to get the Address States via the controller function getAddressStates, to support returning a list of valid states from the USA country to the client. 
6.- Created the Configs table in the Atlas MongoDB, and added an entry named AddressStates which has the list of valid USA states stored. 

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


