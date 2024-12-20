import { handler } from './index.js';

handler({
    Records: [
        {
            s3: {
                bucket: {
                    name: 'terraform-learn-original-bucket'
                },
                object: {
                    key: 'diagram.png'
                }
            }
        }
    ]
})
    .then(console.log)
    .catch(console.error);

