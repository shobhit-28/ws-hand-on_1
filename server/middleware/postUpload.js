import multer from 'multer'

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'), false)
}

const postUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 1.5 * 1024 * 1024 }
})

export default postUpload
