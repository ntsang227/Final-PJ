// multer-storage.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../db/Cloudinary/cloudinary.js');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

module.exports = storage;
