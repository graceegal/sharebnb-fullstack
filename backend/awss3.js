"use strict";

const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



/** AWS function to add a new object into an S3 bucket.
 * Takes key (unique key) and file
 */
async function putIntoBucket(key, file) {
  const data = new PutObjectCommand({
    Bucket: bucketName,
    ContentType: "image/jpg",
    Tagging: "public=yes",
    Key: key,
    Body: file
  });
  try {
    const result = await s3Client.send(
      data);
  } catch (error) {
    console.debug("putIntoBucket errors: ", error);
  }
}

//https://sharebnb-bucket-bb1016.s3.us-west-1.amazonaws.com/testKey5
function getObjectUrl(key, bucketName) {
  return `https://${bucketName}.s3.us-west-1.amazonaws.com/${key}`;
}

module.exports = { putIntoBucket };