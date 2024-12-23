const AWS = require("aws-sdk");

exports.uploadToS3 = async (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY;

  // Ensure environment variables are set
  if (!BUCKET_NAME || !IAM_USER_KEY || !IAM_SECRET_KEY) {
    throw new Error("Missing AWS credentials or bucket name");
  }

  // Configure the AWS S3 client
  AWS.config.update({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_SECRET_KEY,
  });

  const s3 = new AWS.S3();

  // Define the S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read", // You can adjust the ACL as needed
  };

  try {
    // Upload the file to S3
    const uploadData = await s3.upload(params).promise();
    console.log("Upload successful", uploadData);
    return uploadData.Location; // Return the file URL
  } catch (err) {
    console.error("Error uploading to S3", err);
    throw new Error("S3 upload failed: " + err.message);
  }
};
