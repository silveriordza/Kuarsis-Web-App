



//Change the BACKEND_ENDPOINT to point to the desired endpoint for the target environment.
//In case I want to test the BACKEND_ENDPOINT in the local machine then I can change it to 'http://localhost:5000'
//In case I want to test the BACKEND_ENDPOINT in the AWS enviornment, then I can change it to 'https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev'
//This BACKEND_ENDPOPINT constant will be referenced across all actions invoking backend services, and I can also use it to switch to DEV, QA or PROD environments later.

// LOCALHOST DEV VARIABLES
/*
export const BACKEND_ENDPOINT = 'http://localhost:5000'
export const KUARSIS_PUBLIC_STATIC_FOLDER = 'http://localhost:3000/images'
export const KUARSIS_BANNER_MAIN_LOGO = '/KuarsisLogo256px.png'
export const KUARSIS_PUBLIC_BUCKET_URL =
  'https://kuarsis-products-s3-public-dev.s3.amazonaws.com/'
*/
/*  "proxy": "http://localhost:5000", */
/*
"proxy": "https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev", 
*/

//AWS DEV ENVIRONMENT VARIABLES
export const BACKEND_ENDPOINT = 'https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev'
export const KUARSIS_PUBLIC_STATIC_FOLDER = 'https://dev.kuarsis.com/images'
export const KUARSIS_BANNER_MAIN_LOGO = 'KuarsisLogo256px.png'
export const KUARSIS_PUBLIC_BUCKET_URL = 'https://kuarsis-products-s3-public-dev.s3.amazonaws.com/'

/*PayPal Accounts and Data for Testing:

PERSONAL (Represents the customer part of the transactions):
sb-ru3fa8654408@personal.example.com pass: 12345678
Name: John Doe, Phone 4082268073, Account Id: BTQ4ZAYWN2PYY, Country: US 

BUSINESS (Represents the business part of the transactions)
sb-grklv8654311@business.example.com pass: 12345678
Name: John Doe, Phone 4084925537, Account Id: 6DL3EUVM82UDS

ACTUAL BUSINESS ACCOUNT where my test transactions are going: 
sb-myqv48599323@business.example.com pass: 12345678

Use the Paypal Sandbox account to check the test transactions in paypal.

Paypal Sandbox:
Test Accounts https://developer.paypal.com/developer/accounts
Papal Sandbox Test Site: https://www.sandbox.paypal.com/
Paypal Sandbox > accounts page: https://developer.paypal.com/developer/accounts

Paypal Live site: https://www.paypal.com/?_ga=1.174395558.565967115.1654411204


*/
