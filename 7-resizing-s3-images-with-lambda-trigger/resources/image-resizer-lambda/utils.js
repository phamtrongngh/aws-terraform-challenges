const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

export const extToMime = (ext) => {
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        case 'webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
}

export const isImage = (ext) => IMAGE_TYPES.includes(ext);

export const streamToBuffer = async (stream) => Buffer.concat(await (stream).toArray());
