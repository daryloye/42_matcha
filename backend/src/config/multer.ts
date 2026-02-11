/*
What we need to configure:

Where to store files (uploads/ folder)
How to name files (unique filename to avoid conflicts)
File validation (only images, max 5MB) 
*/

import multer from 'multer';
import path from 'path'