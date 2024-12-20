import { S3Client } from '@aws-sdk/client-s3';


const config = {}

// // The credentials should only be used for development purposes. In production, use IAM roles
// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
//     config.credentials = {
//         accessKeyId: AWS_ACCESS_KEY_ID,
//         secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     };
//     console.log("Using credentials for S3 client");
// }

const S3 = new S3Client(config);

export default S3;