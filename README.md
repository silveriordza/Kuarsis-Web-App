Kuarxis Web App is the code for the official website of Kuarxis Companies.
Author: Silverio Rodriguez Alcorta
Kuarxis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version Description: ArtPixan WebPage child of Kuarxis Companies, focused on selling Art throu ArtPixan webpage. Pixan means spirit in Mayan language.


//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfdev-v1.0.0.4
Version date: 5/30/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added the isShippable flag to the ProductEditScreen and to the ProductListAdminScreen, to show when the product is shippable or not, and also to create product with this flag or update the product with this flag. 
2.- Added a LogThis function into the Logger.js file in the utils folder. This function will log a user provided message into the console.log only when the LOG_LEVEL constant is equal or greater to 1, this value can be set in the environmentConstants.js file.
3.- Added address information (address, internal number, city, state, postal code, country) into the User Profile, User Registration, User Details Admin. 
4.- Added product types to the products to mark when they are shippable, downloadable, bookable, and image protected, including columns in the Product List Admin. 
5.- Added logic into the OrderScreen that identifies when any of the products in the order, are shippable, in which case it shows up the Mark as Delivered button (if the user is admin), shows Download button only for downloadable products, the "To be shipped"/"Shipped" message, and the "To be booked" "booked" message for products that are shippable and bookable correspondingly. If the order has not been paid, the Download button will not show up, nor the shipped or booked messages.

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
1.- Added new logic to remove secrets from .env files and environment variables,  to avoid exposing this secrets when commiting to github. Added secret values to AWS SSM Parameters Store using amplify function update, option update secrets, then added logic into the NodeJs App.js file to get secrets using SSM.getParameters. Also updated the environment variables to remove secrets into the Lambda function environment variables configurations. 
2.- Removed the AWSConfig.js file since all process.env variables are now accessed directly and not thrugout AWSConfig.js.


