///Change the BACKEND_ENDPOINT to point to the desired endpoint for the target environment.
//In case I want to test the BACKEND_ENDPOINT in the local machine then I can change it to 'http://localhost:5000'
//In case I want to test the BACKEND_ENDPOINT in the AWS enviornment, then I can change it to 'https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev'
//In case I want to test the BACKEND_ENDPOINT in the AWS PIXANDEV dev enviornment, then I can change it to 'https://r8chx2099g.execute-api.us-east-1.amazonaws.com/pixandev'
//In case I want to test the BACKEND_ENDPOINT in the AWS PIXAN prod enviornment, then I can change it to 'https://7p1h5lrqd5.execute-api.us-east-1.amazonaws.com/pixan'
//This BACKEND_ENDPOPINT constant will be referenced across all actions invoking backend services, and I can also use it to switch to DEV, QA or PROD environments later.
//In case I want to test in AWS environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://www.kuarsis.com/images'
//In case I want to test in AWS PIXANDEV environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://pixandev.kuarsis.com/images'
//In case I want to test in AWS PIXANDEV environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'https://pixan.kuarsis.com/images'
//In case I want to test in localhost environment I have to change the KUARSIS_PUBLIC_STATIC_FOLDER to 'http://localhost:3000/images'


// LOCALHOST DEV VARIABLES
/*
export const BACKEND_ENDPOINT = 'http://localhost:5000'
export const KUARSIS_PUBLIC_STATIC_FOLDER = 'http://localhost:3000/images'
export const KUARSIS_BANNER_MAIN_LOGO = '/KuarsisLogo256px.png'
export const KUARSIS_PUBLIC_BUCKET_URL =
  'https://kuarsis-products-s3-public-dev.s3.amazonaws.com/'
*/
//CONSTANTS FOR DEV.KUARSIS.COM ENVIRONMENT
/*
export const BACKEND_ENDPOINT = 'https://ikhmic2rag.execute-api.us-east-1.amazonaws.com/dev'
export const KUARSIS_PUBLIC_STATIC_FOLDER = 'https://dev.kuarsis.com/images'
export const KUARSIS_BANNER_MAIN_LOGO = 'KuarsisLogo256px.png'
export const KUARSIS_PUBLIC_BUCKET_URL = 'https://kuarsis-products-s3-public-dev.s3.amazonaws.com/'
*/

//CONSTANTS FOR PIXANDEV.KUARSIS.COM (DEV) ENVIRONMENT

export const BACKEND_ENDPOINT =
  'https://o3dzma966j.execute-api.us-east-1.amazonaws.com/kuarxbedev'
export const KUARSIS_PUBLIC_STATIC_FOLDER =
  'https://pixandev.kuarsis.com/images'
export const KUARSIS_BANNER_MAIN_LOGO = 'PixanLogo256px.png'
export const KUARSIS_PUBLIC_BUCKET_URL =
  'https://kuarsis-products-s3-public-dev.s3.amazonaws.com/'


//CONSTANTS FOR PIXAN.KUARSIS.COM (PROD) ENVIRONMENT
/*
export const BACKEND_ENDPOINT =
  'https://7p1h5lrqd5.execute-api.us-east-1.amazonaws.com/pixan'
export const KUARSIS_PUBLIC_STATIC_FOLDER = 'https://pixan.kuarsis.com/images'
export const KUARSIS_BANNER_MAIN_LOGO = 'PixanLogo256px.png'
export const KUARSIS_PUBLIC_BUCKET_URL =
  'https://kuarsis-products-s3-public.s3.amazonaws.com/'
*/

/*
For information about dev and prod users for testing, consult the "Setps to setup Kuarsis Web Page for a new GIT repository.docx" 
document at the root of Kuarsis folder
*/

