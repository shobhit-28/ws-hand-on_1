import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile-pictures',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }]
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error(`Only image files are allowed!`), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }
})


export default upload;