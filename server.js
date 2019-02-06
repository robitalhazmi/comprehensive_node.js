// Main server
const express = require('express'),
// Set up MongoDB database
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
// Require ItemRoutes file
itemRouter = require('./src/routes/itemRoutes'),
path = require('path'),
nodeMailer = require('nodemailer'),
// HTTP request package
request = require('request');

const app = express();

var port = 3000;

app.listen(port, function(){
    console.log('Server is running on port:', port);
});

// Set view engine
app.set('view engine', 'ejs');
// Serving static files from serve
app.use(express.static('public'));
// Parses data to json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Create routes
app.use('/items', itemRouter);

// Set up a routing
app.get('/', function(req, res){
    res.render('index');
});
// ====================
// Route for email page
app.get('/email', function (req, res) {
    res.render('email');
});
// Route for post request
app.post('/send-email', function (req, res) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'sisteminformasiua15@gmail.com',
            pass: '15siadmin'
        }
    });
    let mailOptions = {
        from: '"Simolas" <sisteminformasiua15@gmail.com>',
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.body,
        html: '<b>NodeJS Email Tutorial</b>'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.render('email');
    });
});
// ====================
// Access recaptcha page
app.get('/captcha', function (req, res) {
    res.render('captcha');
});
// Handle response
app.post('/captcha', function (req, res) {
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({
            "responseError": "Please select captcha first"
        });
    }
    const secretKey = "6LdxdY8UAAAAAL6dntB-bAnq7yvnVSwIRfKsvxns";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function (error, response, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return res.json({
                "responseError": "Failed captcha verification"
            });
        }
        res.json({
            "responseSuccess": "Success"
        });
    });
});


// Connect with Mongo database
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/aufinancex?authSource=admin', {useNewUrlParser: true})
.then(() => { // if all is ok we will be here
    console.log('Connected');
})
.catch(err => { // if error we will be here
    process.exit(1);
});
