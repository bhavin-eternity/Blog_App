const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    isValid ? cb(null, true) : cb(new Error('Images only'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;