const { v2: fileUploadService } = require('cloudinary');
const fs = require('fs');
const config = require('../config/config');

fileUploadService.config({
  cloud_name: config.cloudinary.cloudinary_cloud_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const uploadFileOnCloud = async (serverLocalFilePath) => {
  if (!serverLocalFilePath) {
    throw new Error('No file path available!');
  }
  try {
    const fileUploadResponse = await fileUploadService.uploader.upload(serverLocalFilePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(serverLocalFilePath);
    return fileUploadResponse;
  } catch (error) {
    fs.unlinkSync(serverLocalFilePath);
    throw new Error(' File unlinked !');
  }
};

module.exports = uploadFileOnCloud;
