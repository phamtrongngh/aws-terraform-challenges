import Sharp from 'sharp';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import S3 from './s3.js';
import { streamToBuffer, extToMime, isImage } from './utils.js';

const RESIZED_BUCKET = process.env.RESIZED_BUCKET;

export const handler = async (event) => {
    // Receive the S3 event
    console.log("Event: ", JSON.stringify(event));
    const { bucket, object } = event.Records[0].s3;

    // Check if the object is an image based on its extension
    const objExt = object.key.split('.').pop();
    if (!isImage(objExt)) {
        console.log("Not processing object as it is not an image");
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Object is not an image',
            })
        };
    }

    // Get the image from the original S3 bucket
    const getObjectCommand = new GetObjectCommand({
        Bucket: bucket.name,
        Key: object.key
    });
    const { Body } = await S3.send(getObjectCommand);

    // Convert body stream to buffer
    const imageBuffer = await streamToBuffer(Body);

    // Resize the image to 3 different sizes: 100x100, 200x200, 300x300
    const sizes = [100, 200, 300];
    const resizedImages = await Promise.all(sizes.map(async (size) => {
        return await Sharp(imageBuffer).resize(size, size).toBuffer();
    }));

    // Upload the resized images to the resized S3 bucket
    const putObjectCommands = resizedImages.map((resizedImage, index) => {
        return new PutObjectCommand({
            Bucket: RESIZED_BUCKET,
            Key: `${sizes[index]}x${sizes[index]}/${object.key}`,
            Body: resizedImage,
            ContentType: extToMime(objExt),
        });
    });
    await Promise.all(putObjectCommands.map(command => S3.send(command)));

    console.log('Images resized successfully');
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Images resized successfully',
        })
    };
}