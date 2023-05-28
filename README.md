Kuarxis Web App is the code for the official website of Kuarxis Companies.
Author: Silverio Rodriguez Alcorta
Kuarxis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version Description: ArtPixan WebPage child of Kuarxis Companies, focused on selling Art throu ArtPixan webpage. Pixan means spirit in Mayan language.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: arpixwfprd-v1.0.0.2
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


