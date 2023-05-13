const awsConfigs = {
  s3: {
    kuarsisProductsS3AccessKey: process.env.KUARSIS_AWS_PRODUCTS_S3_ACCESS_KEY,
    kuarsisProductsS3SecretyKey: process.env.KUARSIS_AWS_PRODUCTS_S3_SECRET_KEY,
    publicBucketName: process.env.KUARSIS_PUBLIC_BUCKET_NAME,
    privateBucketName: process.env.KUARSIS_PRIVATE_BUCKET_NAME,
  },
  Globals: {
    awsMainRegion: process.env.KUARSIS_AWS_KUARSIS_MAIN_REGION,
  },
}
module.exports = { awsConfigs }
