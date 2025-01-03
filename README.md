<!-- @format -->

Kuarxis Web App is the code for the Kuarxis Survey System
Author: Silverio Rodriguez Alcorta
Kuarxis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version Description: Kuarxys Survey System WebPage child of ArtPixan WebPage, focused on analyzing results of Survey Monkey surveys.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.8.2
Version date: 01/02/25
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Issue fixed: when surveys does not have any Integer (Numeric) value and only contain strings, it had an error related to "Cannot delete child", because the DataGrid in the SurveyOutputScreen specifically in the KuarxisDataGrid.js component was adding AggregateColumnDirectives for all columns that were Integer, but if there are no Integers it resulted in a the AggregateDirective parent of AggregateDirective in which turn it didn't have any AggregateColumnsDirective because the no outputlayout.dataType="Integer". To fix this, we added a condition to check if there is any Integers in survey output layout, if there are non, then the whole AggregatesDirective section is not added, otherwise it is added and it will add corresponding child directives for all integer columns.
2.- Flexibility added to the SurveyOutput Dashboard to allow dinaymic configuration of the pieCharts for the Surveys.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.8.1 -> tagkuarxisFeSurveySystemQA-v1.0.8.1
Version date: 6/9/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Added React memo to the DataGrid component in SurveyOuputsScreen to memoize the DataGrid component, this in order to fix performance issue when user typing a new search keyword or changing the page setting was causing slow performance, user was not even able to see the text he typed or the page number he typed because the DataGrid was re-rendering the whole grid on every letter the user typed causing long delay between the user typing the letter, grid rendering and then React showing the letter the user typed took about 5 to 6 seconds, which was a bad user experience. This was fixed by creating a new component called KuarxisDataGrid and memoizing it using the memo feature of React, then on the memo comparison there is an isReRender flag which will be always false meaning do not render and is also checking if the page setting changed, this will cause the KuarxisDataGrid component not to render when the user is changing the search keyword or if the user has not changed the page setting, given that the other props like SurveyOutputsInfo and the gridDataSourceArray will change only when the timer of the keyword Search or the timer of the page setting has triggered, the KuarxisDataGrid component will render only when those props change, it will not render of the keyword Search or the page Setting has not triggered the timer to commit the changes yet. This fixed the performance issue.

NOTES:
No changes to back end were needed in this version, only front end changes.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.8.0 and tagkuarxisFeSurveySystemQA-v1.0.8.0
Version date: 6/2/24
Modificator name: Silverio Rodriguez Alcorta
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
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.7.0
Version date: 4/19/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Added functionality in the SurveyOutputScreen to export the data of a selected survey in the list of surveys, it will export it as a CSV file with the columns names displayed vertically and values on the side.
2.- Added fucntionality to export all the data in the survey list into a CSV file.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.6.1
Version date: 4/01/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Front end redesign to support the backend redesign of processing outputs and answers.
2.- Added functionality to download the survey answer output as a text file showing the columns vertically and the values beside.
3.- Removed the Upload Surveys Answers option from the menu, since it is no longer needed. This option was replaced by the function bulksurveymonkeywebhook in the back end that will upload all answers to the Survey System coming form Survey Monkey by getting a list of responsdent ids as parameter of the web service request.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.0.5
Version date: 1/13/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed defect: negative number showing up in the upload status in UploadSurveyAnswers when picking option NEW responses only. This fix was made in the Front End surveyActions.js in the slice calculations.
2.- Modularized the Survey Monkey calls into a MonkeyManager class, for better code reusability. Removed logic form the path surveys/surveymonkey/:id handler and transfered it to the MonkeyManager, the handler now calls MonkeyManager functions to execute logic and it only servers as a controller of the logic.
3.- Added a MonkeyWebhook for Completed Survey event with its corresponding handler function on the path surveys/surveymonkey/webhookcompletedeventTalentos2020. This path will be triggered by Survey Monkey whenever a new survey response is completed by a user, and it will also trigger the processing of the survey responses in the KSS system which will then store the responses into the corresponding output collection.
4.- Redesigned the update responses handler to integrate it with the MonkeyWebhook (mentioned above) so that when the webhook is triggered, the update responses function will process the survey accordingly.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemDEV-v1.0.0.4
Version date: 12/24/23
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Optimized the survey action to process Upload Answers by adding an option to only upload new answers, or reprocess the whole file again. This improved the upload time from 1.5 min to only 5 seconds for an average of 6 new answers on the files, instead of reprocessing all surveys which took the 1.5 min waiting time.
2.- Started integration with Survey Monkey to check which are the new answers added comparing versus the existent answers in the database.
3.- Started integratiion of the Create Survey Configs with Survey Monkey API to map the Survey System config to the survey monkey configs and later use it to get answers from Survey Monkey API automatically without uploading a file manually.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: tagkuarxisFeSurveySystemQA-v1.0.0.3
Version date: 12/19/23
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed issue when username is created with all UPPERCASE, but then users logs in with user in lowercase, the system was not finding that user and declined access. Fixed issue by making the user name search case-insensitive using RegEx with the i option when looking for username in mongoose User.FindOne.
2.- Fixed issue with the User Edit screen sometimes it tries to load the data when the User info is still undefined, added a additiona condition to the IF statement in the useEffect to check if User object is undefined, in which case it will dispatch the getUserDetails action, all this in the UserEditScreen.
3.- Returning a more friendly message when user and password does not match, saying "Email o password inválidos."

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxisFeSurveySystem-v1.0.0.2
Version date: 12/18/23
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed intermitemn disconnection issue. Root cause: the JWT_SECRET to validate token, sometimes was not populated in the process.env.JWT_SECRET variable, there seems to be a problem with it. I changed the logic to get the secret value directly from aws usig the SSM AWS module. Created new library awsMiscellaneous.js to include a function to return the secret value from AWS given the variable name.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: kuarxisFeSurveySystem-v1.0.0.1
Version date: 12/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- First version delivered to client including
a.- Display of surveys calculated resouts and general respondent information in the Survey Output screen.
b.- Upload of Survey Monkey Numeric and Real export files, calculation of results and generation of OutputReport.csv file after uploading.
c.- Users management (sign-up, sign-in, user profile modification)
d.- Home page with highlights about the company, and objectives of the survey system.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfdev-v1.0.0.5
Version date: 6/26/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added functionality to the Store Screen to show the store products grouped by Category. User can now set the same Category to a subset of products and a different category to another subset, then the Store Screen will group all products that have the same Category in the Store Screen.
2.- Fixed bug Jira KXWA-24: Logout from Product List Admin screen cannot read isAdmim JIRA.
3.- Fixed bug Jira KXWA-35: OrderScreen user clicks product name link that then shows a blank page; now it is showing the Product Detail screen.
4.- Fixed bug Jira KXWA-53: OrderScreen user clicks product name link when order is already paid, that then shows a blank page; it is now showing the Product Detail screen.
5.- Fixed bug Jira KXWA-33: After user pays an order, and still on the order paid confirmation screen, if the user logout, a blank page shows up; now it is taking the user back to the Store Screen.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfdev-v1.0.0.4
Version date: 6/19/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added the isShippable flag to the ProductEditScreen and to the ProductListAdminScreen, to show when the product is shippable or not, and also to create product with this flag or update the product with this flag.
2.- Added a LogThisLegacy function into the Logger.js file in the utils folder. This function will log a user provided message into the console.log only when the LOG_LEVEL constant is equal or greater to 1, this value can be set in the environmentConstants.js file.
3.- Added address information (address, internal number, city, state, postal code, country) into the User Profile, User Registration, User Details Admin.
4.- Added product types to the products to mark when they are shippable, downloadable, bookable, and image protected, including columns in the Product List Admin.
5.- Added logic into the OrderScreen that identifies when any of the products in the order, are shippable, in which case it shows up the Mark as Delivered button (if the user is admin), shows Download button only for downloadable products, the "To be shipped"/"Shipped" message, and the "To be booked" "booked" message for products that are shippable and bookable correspondingly. If the order has not been paid, the Download button will not show up, nor the shipped or booked messages.
6.- Issue resolved: PayPalButtons disappearing from the OrderScreen. Redesigned OrderScreen useEffect to separate static values from dynamic values and added a semaphore flag to avoid charging PayPalButton script more than once while the script is still being loaded.
7.- Improved the OrderScreen useEffect logic, separating static from dynamic objects, loading the static ones only once and the dynamic ones everytime one or more objects change.
8.- Added logic into the RegisterScreen to display a list of states as a drop down to validate the State when user is providing the address information. Added configsReducer, configsActions, configsConstants, and updated the RegisterScreen to get the AddressStates information from the backend.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfdev-v1.0.0.3
Version date: 5/27/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added Admin Users List and the Update User Details pages, now the page is able to administer users, see them change password and mark/unmark them as Admins.
2.- Added Admin Orders List, now the page is able to manage the orders, see them and mark them as delivered.
3.- Added the Orders List to the User Profile screen, now the users are able to see their own orders on their profile.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfdev-v1.0.0.2
Version date: 5/27/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Renamed business specific file names like PixanHomeScreen to a more generic name ProductsStoreScreen, same for all other specific file names, this in order to reuse it for different businesses that have similar website structure, that way we don't have to keep changing the javascript filenames just because the business has a different name.
2.- Rebranded Kuarxis to Kuarxis on all the javascript files, text, titles, business names, webpages, react components, etc. this because the name Kuarxis turned to be the name of a person, therefore we rebranded it to Kuarxis which is not own by anyone as of 5/27/23.
3.- Renamed the database.js file to businessconfigurations.js, to better reflect the purpose of that file which is: contain the specific texts and busiess names and settings for the website which is generic and tailore it to the business specific case.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v1.0.0.1-front-dev
Version date: 5/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added new logic to remove secrets from .env files and environment variables, to avoid exposing this secrets when commiting to github. Added secret values to AWS SSM Parameters Store using amplify function update, option update secrets, then added logic into the NodeJs App.js file to get secrets using SSM.getParameters. Also updated the environment variables to remove secrets into the Lambda function environment variables configurations.
2.- Removed the AWSConfig.js file since all process.env variables are now accessed directly and not thrugout AWSConfig.js.
