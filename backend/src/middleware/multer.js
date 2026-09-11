import multer, { memoryStorage } from 'multer';

const storage = multer.memoryStorage()
const upload = multer({
    dest:"uploads/"
});

export default upload;
