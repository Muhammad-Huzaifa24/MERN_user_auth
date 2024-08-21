const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "profile_pictures",
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary };
