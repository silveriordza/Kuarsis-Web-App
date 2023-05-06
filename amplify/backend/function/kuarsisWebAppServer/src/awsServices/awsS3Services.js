const AWS = require('aws-sdk')
const { json } = require('body-parser')
const fs = require('fs')
const { awsConfigs } = require('./awsConfigs.js')

function createS3Instance() {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: awsConfigs.s3.kuarsisProductsS3AccessKey,
      secretAccessKey: awsConfigs.s3.kuarsisProductsS3SecretyKey,
    },
    region: awsConfigs.Globals.awsMainRegion,
  })
  return s3
}

async function uploadKuarsisProductToS3(fileObj) {
  //console.log({ fileObj })

  const s3 = createS3Instance()
  const fileStream = fs.createReadStream(fileObj.filepath)
  console.log(
    'awsS3Service: publicBucketName: ',
    awsConfigs.s3.publicBucketName
  )
  const params = {
    Body: fileStream,
    Bucket: awsConfigs.s3.publicBucketName,
    Key: `PIXPUB_${Date.now()}-${fileObj.originalFilename}`,
  }
  const uploadDataPublic = await s3.upload(params).promise()
  console.log('awsS3Service after upload public: ', uploadDataPublic)

  const fileStream2 = fs.createReadStream(fileObj.filepath)

  const params2 = {
    Body: fileStream2,
    Bucket: awsConfigs.s3.privateBucketName,
    Key: `PIXPRIV_${Date.now()}-${fileObj.originalFilename}`,
  }

  console.log('awsS3Service before upload private: ', params2.Bucket)

  const uploadDataPrivate = await s3.upload(params2).promise()

  console.log('awsS3Service after upload private: ', uploadDataPrivate)

  return uploadDataPublic
}

function createS3InstanceForListProducts() {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: awsConfigs.s3.kuarsisProductsS3AccessKey,
      secretAccessKey: awsConfigs.s3.kuarsisProductsS3SecretyKey,
    },
    region: awsConfigs.Globals.awsMainRegion,
    apiVersion: '2006-03-01',
    params: { Bucket: awsConfigs.s3.publicBucketName },
  })
  return s3
}

// Show the photos that exist in an album.
async function listKuarsisProducts() {
  const s3 = createS3InstanceForListProducts()
  var listOfProducts = {
    BucketUrl: '',
    Data: {},
  }
  const filesPrefix = '_'

  await s3
    .listObjects({ Prefix: filesPrefix }, function (err, data) {
      if (err) {
        throw err
      }
      // 'this' references the AWS.Request instance that represents the response
      listOfProducts.BucketUrl =
        this.request.httpRequest.endpoint.href +
        'kuarsis-products-s3-bucket-public' +
        '/'
      listOfProducts.Data = data
    })
    .promise()
  return listOfProducts
}

async function getPresignedURL(key) {
  const s3 = createS3Instance()
  const params = {
    Bucket: awsConfigs.s3.privateBucketName,
    Key: key,
    Expires: 60, //The presigned URL will expire in 60 seconds
    ResponseContentDisposition: `attachment; filename="${key}"`,
  }
  console.log(
    'Before getSignedURL: ',
    awsConfigs.s3.privateBucketName,
    ' Key: ',
    key
  )
  //Note that a getObject is specified to get the signed URL
  const preSignedURL = await s3.getSignedUrl('getObject', params)

  console.log('After getSignedURL: ', preSignedURL)
  return preSignedURL
}

async function getUploadPublicPrivatePresignedURL() {
  const s3 = createS3Instance()
  let filename = Date.now() // random file name
  const paramsPublicBucket = {
    Bucket: awsConfigs.s3.publicBucketName,
    Key: `${filename}.jpg`,
    //Here use image/jpeg as ContentType because the Public URL is not for automatic download, only for read and show the photo in the brownser.
    ContentType: 'image/jpeg',
    Expires: 60, //The presigned URL will expire in 60 seconds
  }
  console.log('awsS3Services.getPublicPresignedURL BEFORE getSignedURL')
  //Note that a getObject is specified to get the signed URL
  const urlPublic = await s3.getSignedUrl('putObject', paramsPublicBucket)
  console.log('awsS3Services.getPublicPresignedURL signedURL: ', urlPublic)

  const paramsPrivateBucket = {
    Bucket: awsConfigs.s3.privateBucketName,
    Key: `${filename}.jpg`,
    /*
    Set the content type to octet-stream, to allow the photo to be downloaded when the user clicks the download button.
    If the content type is not set to octet-stream, it will be image/jpeg by default and the photo download will not work, 
    it will show the photo in the browser instead. Make sure to also set the AXIOS.PUT request when uploading the photo to the
    s3 bucket, as Content-Type = application/octet-stream otherwise the Presigned URL will not match and it will deny access.
     */
    ContentType: 'application/octet-stream',
    Expires: 60, //The presigned URL will expire in 60 seconds
  }
  console.log('awsS3Services.getPublicPresignedURL BEFORE getSignedURL')
  //Note that a getObject is specified to get the signed URL
  const s3v2 = createS3Instance()
  const urlPrivate = await s3v2.getSignedUrl('putObject', paramsPrivateBucket)
  console.log('awsS3Services.getPublicPresignedURL signedURL: ', urlPrivate)

  return {
    preSignedPublicURL: urlPublic,
    preSignedPrivateURL: urlPrivate,
    fileS3Name: `${filename}.jpg`,
  }
}

module.exports = {
  uploadKuarsisProductToS3,
  listKuarsisProducts,
  getPresignedURL,
  getUploadPublicPrivatePresignedURL,
}
