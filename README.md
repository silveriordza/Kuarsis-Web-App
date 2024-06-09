<!-- @format -->

Kuarsis Web App is the code for the official website of Kuarsis Companies.
Author: Silverio Rodriguez Alcorta
Kuarsis Owner CEO, CTO: Silverio Rodriguez Alcorta
Application Description: This is the backend all Web Front End Kuarxis applications are sharing.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisBeSurveySystemDEV-v1.0.8.1 -> tagkuarxisBeSurveySystemQA-v1.0.8.1
Version date: 6/9/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Added React memo to the DataGrid component in SurveyOuputsScreen to memoize the DataGrid component, this in order to fix performance issue when user typing a new search keyword or changing the page setting was causing slow performance, user was not even able to see the text he typed or the page number he typed because the DataGrid was re-rendering the whole grid on every letter the user typed causing long delay between the user typing the letter, grid rendering and then React showing the letter the user typed took about 5 to 6 seconds, which was a bad user experience. This was fixed by creating a new component called KuarxisDataGrid and memoizing it using the memo feature of React, then on the memo comparison there is an isReRender flag which will be always false meaning do not render and is also checking if the page setting changed, this will cause the KuarxisDataGrid component not to render when the user is changing the search keyword or if the user has not changed the page setting, given that the other props like SurveyOutputsInfo and the gridDataSourceArray will change only when the timer of the keyword Search or the timer of the page setting has triggered, the KuarxisDataGrid component will render only when those props change, it will not render of the keyword Search or the page Setting has not triggered the timer to commit the changes yet. This fixed the performance issue.

NOTES:
No changes to back end were needed in this version, only front end changes.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemQA-v1.0.8.0
Version date: 6/02/24
Modificator name: Silverio Rodriguez Alcorta
Description: Promoted tagkuarxisBeSurveySystemDEV-v1.0.8.1 from Dev to QA as tagkuarxisBeSurveySystemQA-v1.0.8.0 as is.
ENHANCEMENTS:
1.- Added functionality in the SurveyOutputData screen to export to Word, and export data to Excel.
2.- Added functionality to show percent bars in the gridComponent.
3.- Added functionality to show a semaphore (green, yellow, red) indicator for those survey results that are normal, moderate or severe syntoms.
4.- Added functionality to show pieChart for the whole group of surveys answered, for FIAD-15, Beck and Hamilton.
5.- Added functionality to filter the gridComponent when the user clicks in one of the segments on the pie charts.
6.- Added functionality to persist the data using Dexie and indexeddb in Chrome to store user settings and filters to the user don't have to retype the filter everytime it goes away and comes back to a page.
7.- Improved performance of the dataGrid render by removing the autoFitColumns feature since it is really slow.
8.- Added functionality to adjust automatically the scroll height of the gridComponent based on the number of rows (Page Size) selected by the user.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemQA-v1.0.6.1
Version date: 4/01/24
Modificator name: Silverio Rodriguez Alcorta
Description: Promoted tagkuarxisBeSurveySystemDEV-v1.0.6.1 from Dev to QA as tagkuarxisBeSurveySystemQA-v1.0.6.1 as is.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemDEV-v1.0.6.1
Git Feature Dev branch: tagkuarxisBeSurveySystemDEV-v1.0.6.1
Version date: 4/01/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Full redesign for the survey templates processing.
2.- Full redesign for the survey monkey integration.
3.- Full redesign for the survey monkey answers processing.
4.- Full redesign for the survey output generation.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemDEV-v1.0.5.1
Version date: 2/25/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed defect: columns in surveyoutput screen showing in disorder, fixed it in surveyController superSurveyGetOutputValues function, added a sort action by the sequence fieldname into the await SurveySuperiorOutputLayout.find, this fixed the column order displayed in the screen. The weird thing here was that it was working before, but somehow this defect reappeared in DEV and also in QA environments of Oncare.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemQA-v1.0.0.5
Version date: 1/13/24
Modificator name: Silverio Rodriguez Alcorta
Description: Promoted tagkuarxisBeSurveySystemDEV-v1.0.0.5 from Dev to QA as tagkuarxisBeSurveySystemQA-v1.0.0.5 as is.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisBeSurveySystemDEV-v1.0.8.1 -> tagkuarxisBeSurveySystemQA-v1.0.8.1
Version date: 6/9/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Added React memo to the DataGrid component in SurveyOuputsScreen to memoize the DataGrid component, this in order to fix performance issue when user typing a new search keyword or changing the page setting was causing slow performance, user was not even able to see the text he typed or the page number he typed because the DataGrid was re-rendering the whole grid on every letter the user typed causing long delay between the user typing the letter, grid rendering and then React showing the letter the user typed took about 5 to 6 seconds, which was a bad user experience. This was fixed by creating a new component called KuarxisDataGrid and memoizing it using the memo feature of React, then on the memo comparison there is an isReRender flag which will be always false meaning do not render and is also checking if the page setting changed, this will cause the KuarxisDataGrid component not to render when the user is changing the search keyword or if the user has not changed the page setting, given that the other props like SurveyOutputsInfo and the gridDataSourceArray will change only when the timer of the keyword Search or the timer of the page setting has triggered, the KuarxisDataGrid component will render only when those props change, it will not render of the keyword Search or the page Setting has not triggered the timer to commit the changes yet. This fixed the performance issue.

NOTES:
No changes to back end were needed in this version, only front end changes.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemQA-v1.0.8.0 and tagkuarxisBeSurveySystemDEV-v1.0.8.0
Version date: 6/02/24
Modificator name: Silverio Rodriguez Alcorta
Description: Promoted tagkuarxisBeSurveySystemDEV-v1.0.8.1 from Dev to QA as tagkuarxisBeSurveySystemQA-v1.0.8.0 as is.
ENHANCEMENTS:
1.- Added functionality in the SurveyOutputData screen to export to Word, and export data to Excel.
2.- Added functionality to show percent bars in the gridComponent.
3.- Added functionality to show a semaphore (green, yellow, red) indicator for those survey results that are normal, moderate or severe syntoms.
4.- Added functionality to show pieChart for the whole group of surveys answered, for FIAD-15, Beck and Hamilton.
5.- Added functionality to filter the gridComponent when the user clicks in one of the segments on the pie charts.
6.- Added functionality to persist the data using Dexie and indexeddb in Chrome to store user settings and filters to the user don't have to retype the filter everytime it goes away and comes back to a page.
7.- Improved performance of the dataGrid render by removing the autoFitColumns feature since it is really slow.
8.- Added functionality to adjust automatically the scroll height of the gridComponent based on the number of rows (Page Size) selected by the user.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemDEV-v1.0.7.0
Git Feature Dev branch: kuarxisBeSurveySystemDEV-v1.0.7.0
Version date: 4/19/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Added all remaining surveys and calculations.
2.- Included code to handle criteria for test descriptive results based on another field total number.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemDEV-v1.0.6.1
Git Feature Dev branch: tagkuarxisBeSurveySystemDEV-v1.0.6.1
Version date: 4/01/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Full redesign for the survey templates processing.
2.- Full redesign for the survey monkey integration.
3.- Full redesign for the survey monkey answers processing.
4.- Full redesign for the survey output generation.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemDEV-v1.0.5.1
Version date: 2/25/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed defect: columns in surveyoutput screen showing in disorder, fixed it in surveyController superSurveyGetOutputValues function, added a sort action by the sequence fieldname into the await SurveySuperiorOutputLayout.find, this fixed the column order displayed in the screen. The weird thing here was that it was working before, but somehow this defect reappeared in DEV and also in QA environments of Oncare.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: tagkuarxisBeSurveySystemDEV-v1.0.0.5
Version date: 1/13/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed defect: negative number showing up in the upload status in UploadSurveyAnswers when picking option NEW responses only. This fix was made in the Front End surveyActions.js in the slice calculations.
2.- Modularized the Survey Monkey calls into a MonkeyManager class, for better code reusability. Removed logic form the path surveys/surveymonkey/:id handler and transfered it to the MonkeyManager, the handler now calls MonkeyManager functions to execute logic and it only servers as a controller of the logic.
3.- Added a MonkeyWebhook for Completed Survey event with its corresponding handler function on the path surveys/surveymonkey/webhookcompletedeventTalentos2020. This path will be triggered by Survey Monkey whenever a new survey response is completed by a user, and it will also trigger the processing of the survey responses in the KSS system which will then store the responses into the corresponding output collection.
4.- Redesigned the update responses handler to integrate it with the MonkeyWebhook (mentioned above) so that when the webhook is triggered, the update responses function will process the survey accordingly.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisBeSurveySystemDEV-v1.0.0.4
Version date: 12/24/23
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Optimized the survey action to process Upload Answers by adding an option to only upload new answers, or reprocess the whole file again. This improved the upload time from 1.5 min to only 5 seconds for an average of 6 new answers on the files, instead of reprocessing all surveys which took the 1.5 min waiting time.
2.- Started integration with Survey Monkey to check which are the new answers added comparing versus the existent answers in the database.
3.- Started integratiion of the Create Survey Configs with Survey Monkey API to map the Survey System config to the survey monkey configs and later use it to get answers from Survey Monkey API automatically without uploading a file manually.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisBeSurveySystemQA-v1.0.0.3
Version date: 12/19/23
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed issue when username is created with all UPPERCASE, but then users logs in with user in lowercase, the system was not finding that user and declined access. Fixed issue by making the user name search case-insensitive using RegEx with the i option when looking for username in mongoose User.FindOne.
2.- Fixed issue with the User Edit screen sometimes it tries to load the data when the User info is still undefined, added a additiona condition to the IF statement in the useEffect to check if User object is undefined, in which case it will dispatch the getUserDetails action, all this in the UserEditScreen.
3.- Returning a more friendly message when user and password does not match, saying "Email o password inválidos."

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxisBeSurveySystem-v1.0.0.2
Version date: 12/18/23
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed intermitemn disconnection issue. Root cause: the JWT_SECRET to validate token, sometimes was not populated in the process.env.JWT_SECRET variable, there seems to be a problem with it. I changed the logic to get the secret value directly from aws usig the SSM AWS module. Created new library awsMiscellaneous.js to include a function to return the secret value from AWS given the variable name.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxisBeSurveySystem-v1.0.0.1
Version date: 12/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- First version delivered to client including
a.- Display of surveys calculated resouts and general respondent information in the Survey Output screen.
b.- Upload of Survey Monkey Numeric and Real export files, calculation of results and generation of OutputReport.csv file after uploading.
c.- Users management (sign-up, sign-in, user profile modification)
d.- Home page with highlights about the company, and objectives of the survey system.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-v1.0.0.6
Version date: 7/09/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added ScheduleComponent from syncfusion, and coded logic to:
1.1 Store appointments on the database.
1.2 User can modify calendar appointments, resize, drag and drop, delete appoinments.
1.3 User is blocked from overlapping appointments.
1.4 User is blocked from adding appointments which start time is not greater than current time by two hours.
1.5 user can delete multiple appointments by selecting them all at once.
2.- Appointments can be booked against a particular product which in turn is provided by a service provider. The scheulde also handles Busy times from provider when he is booked by other users and other products.
3.- Users can only see their own appoitments, but if the provider is busy with other users, thoes timeframes will show up as Busy and Blocked, the user can't book appointments on busy/blocked timeframes.
4.- Added a Message component into the Scheduler component to show error messages when user overlaps appointments, or creates/modify appointments that are no greater than 2 horus of the current time.

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
2.- Added a LogThisLegacy function into the Logger.js file in the utils folder. This function will log a user provided message into the console.log only when the LOG_LEVEL constant is equal or greater to 1, this value can be set with an environment variable LOG_LEVEL.
3.- Added information into the Users table to store the address information (address, internal number, city, state, postal code, country) to support the User Registration process and the User Profile, User Registration, User Details Admin screens in the front end.
4.- Added logic into the GetOrderDetailsById function to return flags shippable, downloadable, bookable and image protected.
5.- Added a new API Path named Configs and its corresponding configsRoutes, configsController, configs model in mongoose, and also the logic to get the Address States via the controller function getAddressStates, to support returning a list of valid states from the USA country to the client.
6.- Created the Configs table in the Atlas MongoDB, and added an entry named AddressStates which has the list of valid USA states stored.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxbedev-v1.0.0.3
Version date: 5/30/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added the isShippable flag to the products model in mongo DB, also updated all related productController functions to take the flag into account.
2.- Added a LogThisLegacy function into the Logger.js file in the utils folder. This function will log a user provided message into the console.log only when the LOG_LEVEL environment variable is equal or greater to 1, this value can be set in the .env file and it also has to be added as an ENVIRONMENT variable in the cloud Lambda Function.

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
1.- Added new logic to remove secrets from .env files and environment variables, to avoid exposing this secrets when commiting to github. Added secret values to AWS SSM Parameters Store using amplify function update, option update secrets, then added logic into the NodeJs App.js file to get secrets using SSM.getParameters. Also updated the environment variables to remove secrets into the Lambda function environment variables configurations.
2.- Removed the AWSConfig.js file since all process.env variables are now accessed directly and not thrugout AWSConfig.js.
