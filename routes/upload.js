import express from 'express';
import path from 'path';
let router = express.Router();
// Import middleware 
import upload from '../uploadMiddleware';
// Import Resize.js file
import Resize from '../Resize';

router.get('/', isLoggedIn, async function (req, res) {
    await res.render('pages/upload');
});
// Handle POST request used node async await
router.post('/post', upload.single('image'), async function (req, res) {
    // Define upload folder
    const imagePath = path.join(__dirname, '../public/images');
    // Pass folder to constructor of Resize class
    const fileUpload = new Resize(imagePath);
    // If the file is not there, displaying an error message in JSON format
    if (!req.file) {
        res.status(401).json({
            errror: 'Please provide an image'
        });
    }
    // Pass image buffer as an argument
    const filename = await fileUpload.save(req.file.buffer);
    // Return file name
    return res.status(200).json({
        name: filename
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/users/login');
    }
}

module.exports = router;