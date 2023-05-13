/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	NODE_ENV
	PORT
	MONGO_URI
	JWT_SECRET
	PAYPAL_CLIENT_ID
Amplify Params - DO NOT EDIT */
let dotenv = require('dotenv')
dotenv.config()
let path = require('path')
let express = require('express')
let morgan = require('morgan')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
let connectDB = require('./config/db.js')
let userRoutes = require('./routes/userRoutes.js')
let productRoutes = require('./routes/productRoutes.js')
let orderRoutes = require('./routes/orderRoutes.js')
let uploadRoutes = require('./routes/uploadRoutes.js')

var bodyParser = require('body-parser')
var fs = require('fs')

//Initialize the environment variables

connectDB()

// declare a new express app
var app = express()

// THIS IS MORGAN FUNCTIONALITY to log in the HTTP requests in the console only when we are in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT, GET, OPTIONS')
  next()
})

/**********************
 * Example get method *
 **********************/
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/upload', uploadRoutes)
app.get('/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// This route is only to fetch the server for the paypal client id which is in an environment variable and then return it to the client to execute the payment.
//app.get('/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))
console.log('Express products route added')

app.listen(5000, () => {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
