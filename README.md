<!-- @format -->

Kuarxis Web App is the code for the official website of Kuarxis Companies.
Author: Silverio Rodriguez Alcorta
Kuarxis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version Description: ArtPixan WebPage child of Kuarxis Companies, focused on selling Art throu ArtPixan webpage. Pixan means spirit in Mayan language.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfdev-v1.0.0.6
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
