Kuarsis Web App is the code for the official website of Kuarxis Companies.
Author: Silverio Rodriguez Alcorta
Kuarsis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version Description: ArtPixan WebPage part of Kuarxis Companies, focused on selling Art throu ArtPixan webpage. Pixan means spirit in Mayan language.
Date: 5/26/23

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v1.0.0.1-front-dev
Version date: 5/14/23
Modificator name: Silverio Rodriguez Alcorta

ENHANCEMENTS:
1.- Added new logic to remove secrets from .env files and environment variables,  to avoid exposing this secrets when commiting to github. Added secret values to AWS SSM Parameters Store using amplify function update, option update secrets, then added logic into the NodeJs App.js file to get secrets using SSM.getParameters. Also updated the environment variables to remove secrets into the Lambda function environment variables configurations. 
2.- Removed the AWSConfig.js file since all process.env variables are now accessed directly and not thrugout AWSConfig.js.


