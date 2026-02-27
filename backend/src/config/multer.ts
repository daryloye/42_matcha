/*
What we need to configure:

Where to store files (uploads/ folder)
How to name files (unique filename to avoid conflicts)
File validation (only images, max 5MB) 
*/

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //callback: save ub uploads
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueName = crypto.randomBytes(16).toString('hex');
        cb(null, `${uniqueName}${extension}`);
    } 
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})