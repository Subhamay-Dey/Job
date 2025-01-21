import multer from 'multer';

const upload = multer({
  dest: "uploads/", // Temporary folder for uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB size limit
});

export default upload;