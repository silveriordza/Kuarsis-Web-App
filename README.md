<!-- @format -->

Kuarxis Web App is the code for the official website of Kuarxis Companies.
Author: Silverio Rodriguez Alcorta
Kuarxis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version Description: ArtPixan WebPage child of Kuarxis Companies, focused on selling Art throu ArtPixan webpage. Pixan means spirit in Mayan language.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Dev Tag: (pending)
Git feature branches: tagkuarxisBeSurveySystemDEV-v1.0.0.4->kuarxisFeSurveySystemDev-SurveyMonkeyIntegration1.0->kuarxisFeSurveySystemDev-SurveyMonkeyIntegration1.0-ClaculatedFieldsRedesign1.0
Version date: 1/07/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Started working on redesigning how the Calculated Fields grups work to have relative position to the Survey position.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: (pending)
Git feature branches: tagkuarxisBeSurveySystemDEV-v1.0.0.4->kuarxisFeSurveySystemDev-SurveyMonkeyIntegration1.0
Version date: 1/07/24
Modificator name: Silverio Rodriguez Alcorta
ENHANCEMENTS:
1.- Fixed defect: negative number showing up in the upload status in UploadSurveyAnswers when picking option NEW responses only. This fix was made in the Front End surveyActions.js in the slice calculations.
2.- Modularized the Survey Monkey calls into a SurveyMonkeyManager class, for better code reusability. Removed logic form the path surveys/surveymonkey/:id handler and transfered it to the SurveyMonkeyManager, the handler now calls SurveyMonkeyManager functions to execute logic and it only servers as a controller of the logic.
3.- Added a SurveyMonkeyWebhook for Completed Survey event with its corresponding handler function on the path surveys/surveymonkey/webhookcompletedeventTalentos2020. This path will be triggered by Survey Monkey whenever a new survey response is completed by a user, and it will also trigger the processing of the survey responses in the KSS system which will then store the responses into the corresponding output collection.
4.- Redesigned the update responses handler to integrate it with the SurveyMonkeyWebhook (mentioned above) so that when the webhook is triggered, the update responses function will process the survey accordingly.

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
