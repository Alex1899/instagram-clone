const util = require("util");
const multer = require("multer");
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require("multer-gridfs-storage");

// function for uploading images to mongodb
const storage = new GridFsStorage({
  url: process.env.MONGODB_CONNECTION_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err){
          return reject(err);
        }

        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: "photos"
        };
        resolve(fileInfo);
      })
    })
  },
});

const upload = multer({ storage })
module.exports = upload;
