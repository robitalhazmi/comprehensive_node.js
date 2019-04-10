import express from 'express';
// Import User model
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let router = express.Router();

router.get('/', function (req, res) {
    res.render('pages/users');
});
router.get('/register', notLoggedIn, function (req, res) {
    res.render('pages/register');
});
router.post('/register', notLoggedIn, function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
    req.checkBody('cfm_pwd', 'Confirm Password must matches with Password').equals(password);

    let errors = req.validationErrors();
    if (errors) {
        res.render('pages/register', {
            errors: errors
        });
    } else {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user = new User({
                    name: name,
                    email: email,
                    password: hash
                });
                user.save().then(function (result) {
                    console.log(result);
                    res.status(200).json({
                        success: 'New user has been created'
                    });
                }).catch(error => {
                    res.status(500).json({
                        error: err
                    });
                });
            }
        });
    }
});
router.get('/login', notLoggedIn, function (req, res) {
    res.render('pages/login');
});
// Passport authenticate middleware
router.post('/login', notLoggedIn, function (req, res) {
    User.findOne({email: req.body.email})
   .exec()
   .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result){
         if(err) {
            return res.status(401).json({
               failed: 'Unauthorized Access'
            });
         }
         if(result) {
            const JWTToken = jwt.sign({
                 email: user.email,
                 _id: user._id
               },
               'secret',
                {
                  expiresIn: '2h'
                });
                return res.status(200).json({
                  success: 'Welcome to the JWT Auth',
                  token: JWTToken
                });
           }
         return res.status(401).json({
            failed: 'Unauthorized Access',
         });
      });
   })
   .catch(error => {
      res.status(500).json({
         error: error
      });
   });;
});
router.get('/logout', isLoggedIn, function (req, res) {
    req.logOut();
    req.flash('success_message', 'You are logged out');
    res.redirect('/users/login');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

export default router;