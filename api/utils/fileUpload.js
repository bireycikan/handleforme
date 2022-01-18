const multer = require('multer');
const path = require('path');
const fsExtra = require('fs-extra');

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../../src/', 'uploads')
    await fsExtra.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname)
  },
})

const upload = multer({
  storage: storage,
})

module.exports = upload