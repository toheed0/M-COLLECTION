const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

require('dotenv').config();

const route = express.Router();

// Configure Cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", process.env.CLOUDINARY_CLOUD_NAME);

const storage=multer.memoryStorage();
const upload=multer({storage});

route.post('/', upload.single('image'), async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const streamUpload = (fileBuffer)=>{
            return new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream((error, result)=>{
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });

        };

        const result = await streamUpload(req.file.buffer);
        res.json({ imageUrl: result.secure_url  });

    }catch(error){
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

});
module.exports = route;