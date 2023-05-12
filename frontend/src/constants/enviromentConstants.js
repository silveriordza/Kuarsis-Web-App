//export const KUARSIS_IMAGES_FOLDER = 'https://www.kuarsis.com/images/'

export const KUARSIS_PUBLIC_BUCKET_URL =
  'https://kuarsis-products-s3-public-dev.s3.amazonaws.com/'

//Change the BACKEND_ENDPOINT to point to the desired endpoint for the target environment.
//In case I want to test the BACKEND_ENDPOINT in the local machine then I can change it to 'http://localhost:5000'
//In case I want to test the BACKEND_ENDPOINT in the AWS DEV enviornment, then I can change it to 'https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev'
//In case I want to test the BACKEND_ENDPOINT in the AWS PROD enviornment, then I can change it to 'https://oatdnj177e.execute-api.us-east-1.amazonaws.com/prod'
//In case I want to test the BACKEND_ENDPOINT in the AWS PIXANDEV enviornment, then I can change it to 'https://r8chx2099g.execute-api.us-east-1.amazonaws.com/pixandev'
//This BACKEND_ENDPOPINT constant will be referenced across all actions invoking backend services, and I can also use it to switch to DEV, QA or PROD environments later.
//In case I want to test Kuarsis Prod in AWS environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://www.kuarsis.com/images'
//In case I want to test Kuarsis Dev in AWS environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://dev.kuarsis.com/images'
//In case I want to test in AWS PIXANDEV environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://pixandev.kuarsis.com/images'
//In case I want to test in AWS PIYYXAN PROD environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://pixan.kuarsis.com/images'
//In case I want to test in localhost environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'http://localhost:3000/images'
//PixanLogo is::'PixanLogo256px.png'
//KuarsisLogo is: 'KuarsisLogo256px.png'

export const BACKEND_ENDPOINT =
  'https://oatdnj177e.execute-api.us-east-1.amazonaws.com/prod'
export const KUARSIS_PUBLIC_STATIC_FOLDER = 'https://www.kuarsis.com/images'
export const KUARSIS_BANNER_MAIN_LOGO = 'KuarsisLogo256px.png'
/*  "proxy": "http://localhost:5000", */
/*
"proxy": "https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev", 
*/

//PayPal prod id set it in env variables: Afx0PsJAZ0js6ovpd0njiK8y0KA-DdzboT-esVHaMtugMfcbeiTfpzzoDnIcgf9tU2OZwV9tVumKsPe_

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
