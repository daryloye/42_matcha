/*
What we need to configure:

Where to store files (uploads/ folder)
How to name files (unique filename to avoid conflicts)
File validation (only images, max 5MB) 
*/

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const uploadDir = process.cwd() + '/uploads';

fs.mkdirSync(uploadDir, {recursive: true});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); //callback: save ub uploads
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueName = crypto.randomBytes(16).toString('hex');
        cb(null, `${uniqueName}${extension}`);
    } 
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',').map(type => type.trim());

    if (allowedTypes?.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('INVALID_FILE_TYPE'));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE),
    }
})
