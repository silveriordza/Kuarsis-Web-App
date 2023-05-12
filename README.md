Kuarsis Web App is the code for the official website of Kuarsis Companies.
Author: Silverio Rodriguez Alcorta
Kuarsis Owner CEO, CTO: Silverio Rodriguez Alcorta
Version 1.0.0
Version Description: This is the initial version of the Kuarsis Web App, it is still in its initial draft and has not been published to wider audiences yet, still requires a goot makeup of the UI.
Date: 11/26/21

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.11
Version date: 7/20/22
Modificator name: Silverio Rodriguez Alcorta
FIXES:
1.- If the user is not an admin, the order screen cannot update the Is Delivered product flag, hence the text was always "Not Delivered" even though the user already clicked the download button and the photo had been delivered. I decided to remove the whole text Is Delvered, since it does not makes sense for Photos, since they are not delivered but downloaded instead at user's will.

ENHANCEMENTS:
1.- Removed the ml-auto style from the header menu to better position the menus.

IMPROVEMENT IDEAS:
1.- Instead of a delivered text, it is to show for each Photo the time remaining to download, and show if the photo has been downloaded or not, I also like to have this valud stored in the database, in case the user has future claims we can check if the photo was downloaded or not by the user.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.10
Version date: 7/19/22
Modificator name: Silverio Rodriguez Alcorta
FIXES:
1.- The AWS Amplify redirect/rewrite implemented on v0.0.0.6, was failing intermitently on the Desktop Chrome browser, and always failing on the Samsung S20 Ultra Chrome Andriod device, hence I decided to use the full URL of the images folder which is https://www.kuarsis.com/images in the Header.js component which makes reference to the Kuarsis Logo in the Header menu. By setting the full URL in the src of the Image component that loads the Kuarsis Logo, it fixed the issue on mobile devices and also on Desktop Chrome.

ENHANCEMENTS:
1.- I added a checkbox input element under the Pixan Photo License Agreement in the Place Order screen, also added logic into the Place Order button so the user cannot place the order until he has agreed with the License by clicking the checkbox.

LESSON LEARNED
1.- I learned how to open the Dev Tools in Chrome for Android mobile device, the info is in this link: https://developer.chrome.com/docs/devtools/remote-debugging/
It can be done by turning on the Dev Tools in your Android phone, then connect it from your Chrome Desktop by typing this URL: chrome://inspect/#devices
You also have to connect the mobile device to your Desktop using a USB cable and then allow access to Dev Tools in the mobile device to your Desktop, once the access is allowed, Chrome will automatically load all the tabs that you have opened into your mobile Chrome, and then click on inspect and it will open the Dev Tools in your desktop to debug or inspect the Chrome Mobile from your phone.
I used this technique to check why the Kuarsis Logo was not loading and it was because the scr still was referencing to the images folder as kuarsis.com/pixan/images instead of kuarsis.com/images even though the REWRITE was already set in the AWS Amplify Hosting console. This may be a failure of the AWS Amplify.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.9
Version date: 7/17/22
Modificator name: Silverio Rodriguez Alcorta
Enhancement:
1.- Added the Pixan Photos License Agreement text on the Place Order screen.
2.- Added instructions to download photo before 5 minutes elapses, otherwise the download link will expire.
3.- Added instructions to print the Order screen as receipt, and also to keep the Order number for the records as proof of Pixan Photo License purchase.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.8
Version date: 7/17/22
Modificator name: Silverio Rodriguez Alcorta
Description:
FIXES:
1.- Aligned the Create Product button in the Product List screen to the right, the bootstrap.min.css file was corrupted, I copied the original file from other application and pasted it into kuarsis-web-app and it fixed the alignment issue. The text-right style was not part of the corrupted bootstrap.min.css

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.7
Version date: 7/17/22
Modificator name: Silverio Rodriguez Alcorta
Description:
FIXES:
1.- Changed year in footer copyright from 2021 to 2022.

2.- When user buys a photo and downloads it, then go back to PIXAN to buy more photos, add to cart, checkout and place order, the previous last downloaded image was downloaded again, because the state of the orderDownladRequest reducer remained as downloadSuccess=true and was never reset to downlaodSuccess=false when the photo was previously downloaded, this got fixed by adding a dispatch of DOWNLOAD RESET type when the image is downloaded.

3.- When user checkout a cart, place an order and pays it, and then tries to go back to PIXAN and start adding photos to the cart again and then do a Checkout the user was taken directly to the Place order screen which showed the previous order already paid and also the buttons to download the photos from the previous order instead of creating a new order, I fixed this by adding a new variable to the CreateOrder reducer to keep track of when an order was paid, and the user will not be redirected to the Placed Order screen if the Order has not been paid, the user has to pay the order first before placing the order.

ENHANCEMENTS:
1.- Added the CART button to the main menu to enable the user to see the cart anytime he wants.
2.- Increased the size of the Public photos from 300x200 px to 600x400 PXs, this to give the user a chance to see the photo bigger, the previous size was very small.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.6
Version date: 7/09/22
Modificator name: Silverio Rodriguez Alcorta
Description:
-Fixed the pagination. The react router path was incorrect because the product page path changed to pixan home, I updated the Pagination coponent to create links pointing to PixanHomeScreen instead of Home, and also added the PixanHomeScreen path in the App.JS main route to add a path when the page is provided when user clicks on the Pagination link page. Also increased the number of products to show on each page to 12, since 10 caused the last row to be blank on the last 2 products, it was not filling the page completely.
-I discovered an issue, when the user tries to access https://www.kuarsis.com/pixan by setting the URL directly in the browser, and when is deployed to AWS it returns an ACCESS DENIED error. After researching I found that this is because a Single Page Application always returns the index.html but when the user tries to access a webpage directly like in this case, the S3 Bucket tries to find the corresponding pixan.html page which is part of the URL, but will not find it because it is a single page application and only index.html must be always returned. When the user clicks on the Pixan option of the Menu, the the Pixan webpage shows successfully, but I the user to be able to access Pixan by typing the URL directly in the browser to go directly to PIXAN without seeing all the other screens from the other Kuarsis copanies. In found the below website describing a similar error:
https://www.codebyamir.com/blog/fixing-403-access-denied-errors-when-hosting-react-router-app-in-aws-s3-and-cloudfront
-Later I found information in this page https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa
That instructs the user, for the case of Single Page Applications, when using AWS Amplify Hosting, a rewrite and redirection setting has to be added as follows:
Original Address: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>
Destination address: /index.html
Redirect Type: 200
Country Code: empty
After adding the above setting in the AWS Amplify console, the user can now access pixan webpage by typing the URL https://www.kuarsis.com/pixan in the browser without passing thru the home page.

-Now the problem was that the Kuarsis logo is not found when accessing pixan by typing the URL in the browser. Need to investigate this issue too.
To solve this problem of the Kuarsis Logo not found when Pixan URL typed directly in the browser, I fixed it with another redirection as follows:
Source Address: https://www.kuarsis.com/*/images/
Target Address: https://www.kuarsis.com/images

That fixed the problem. The problem was that when the Pixan URL is typed in the browser, it tries to map the source address of the Logo as : https://www.kuarsis.com/pixan/images/KuarsisLogo256px.png when in reality it is located in: https://www.kuarsis.com/images/KuarsisLogo256px.png. Redirecting one URL to the other fixed the issue.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.5
Version date: 7/09/22
Modificator name: Silverio Rodriguez Alcorta
Description:

- Menu hamburger button was not showing up on mobile devices, found out that the tag <Navbar.Toggle aria-controls='basic-navbar-nav' /> in the Header.js was commented, after investigating I found out that this tag is the one responsible of making the hamburger button appear on mobile devices when the menu is collapsed, it takes all the menu items on the Navbar and put them together inside the button. To fix the issue I just uncommented that line in Header.js

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.4
Version date: 7/09/22
Modificator name: Silverio Rodriguez Alcorta
Description:
-ProductEditScreen component is now reducing the size of the public photos and drawing a watermark on it to protect copyright in case users download the photo. This was achieved by using the convert function that is part of the libs/imagesLib.js library, it uses canvas, context, image objects and the drawImage and toBlob functions.
-This version also features public and private S3 buckets, the photos used as preview in users browser are public photos stored in the public S3 bucket which only has read only get permissions and not put permissions, also the image has been reduced in size and watermarked to further protect copyright. The private S3 bucket stores the original photos without tampering as is, and it has permissions of GET only from a S3 Signed URL which a specific expiration timeframe, after expiring the URL cannot longer be used, also the image can only be DOWNLOADED from the browser and not displayed in-line, since we are using the octect-stream type of file.

LESSONS LEARNED:

- Cannot invoke Axios with await inside the "then" section of a returned Promise, the await has to be converted into a standard Axios call with Promises handling using THEN syntax.
- Tried to get the modified file from the convert function from the imagesLib.js library in the THEN section of the promise and assign the image to another global variable and then pass it to the Axios PUT to store the image into the S3 bucket, however I learned that the Then section of the promise returned, is asynchronous and it does not wait for the "convert" function to finish and it continues running the axios PUT call which still has a null image. To fix this I moved the AWAIT AXIOS call inside the THEN section of the convert promise, but then the AWAIT keyword was not accepted so I converted it to a standard AXIOS call with Promises THEN instead and it worked like a charm.
- I also removed the use of FileReader from the convert original function since it introduced compiling errors when importing the convert fuction into the ProductEditScreen.js React component, somehow the syntax didn't worked, so I used URL.createObjectURL(file) to read the file and put it into the img.src attribute to load the image into the Image object, instead of using FileReader for that.

KNOWN ISSUES TO BE FIXED IN FUTURE RELEASES: -https://kuarsis.com/pixan cannot be accessed directly from a browser without accessing kuarsis.com first. Same issue for Tech or Taanah pages.
-Need to create a PROD environment with a subdomain in AWS to separate it from DEV environment, once Pixan is ready to GO-LIVE.
https://docs.amplify.aws/cli/teams/overview/

-Pixan PHOTOS are too small, I should change the width and height of the resizing to a bigger size, to give opportunity to the user to see the photo.
-PixanProductScreen needs to SHOW how many Photos are in Stock, but needs to remove the option for the user to Pick how many (Qty) because that does not apply to Photo Licensing.
-Pixan needs a Page showing the License description, and also Legal Agreement and Terms for users. When user purchases a License, what is it allowed and not allowed to do with the Photo.
-Pixan Cart Option needs to do the quantity option as read only not modifiable, since that option does not apply for Photos.
-Order page in the case of Pixan photos should not show the Mark as Delivered button if the user is an Admin since Photos are not delivered but downloaded by the user.
-Order page needs a message alerting the user that photo must be downlaoded quickly no later than 5 minutes after, otherwise the URL to download will expire and that photos are not refundable.

//--------------------------------------------------------------------------------------------------------------------------------------------------
Git Tag: v0.0.0.1
Version date: 6/12/22
Description: Kuarsis website with the following working features:

- Paypal payment for checked-out orders
- Logout redirection to Kuarsis Home page
- Uplopading Pixan Photos working on local host, however not working in AWS Cloud since it is not using S3 buckets but filesystem
  with an express server static folder Uploads which does not work with Lambda functions since they storage is emphemeral in nature.
- Admin user List, Create, Add, Remove and Edit Products fully functional.
