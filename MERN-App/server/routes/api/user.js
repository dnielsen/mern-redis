const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const appSecret = 'appsecret';

const Auth = function(req, res, next) {
    var token = req.headers["access-token"];
    
    if ( !token ) {
        res.json({
            success : false,
            message : 'AccessToken is invalid! Are you logged in?'
        });
    }
    else {
        jwt.verify(token, appSecret, function(err, decoded) {
            User.findOne({ email : decoded.data } , function(err, user) {
                if ( user ) {
                    next();
                }
                else {
                    res.json({
                        success : false,
                        message : 'User not exist!'
                    });
                } 
            })
        });
    }
}

module.exports = (app) => {
    app.post('/api/user/signup', (req, res, next) => {
        var newUser;
        bcrypt.hash(req.body.password, saltRounds)
            .then(function(hash) {
                newUser = new User({
                    firstname : req.body.firstname,
                    lastname : req.body.lastname,
                    email : req.body.email,
                    password : hash
                })
                return newUser.save()
            })
            .then(() => res.json({
                user : newUser,
                success : true
            }))
            .catch((err) => next(err));
    });

    app.post('/api/user/login', (req, res, next) => {
        var email = req.body.email
        var password = req.body.password
        console.log(email)
        User.findOne({ email : email}, (err, user) => {
            if ( user ) {
                bcrypt.compare(password, user.password).then(function(result) {
                    if( result ) {
                        var token = jwt.sign( { data : user.email }, appSecret, { expiresIn : 60*60*24 } ); // expire in 24 hours
                        res.json({
                            token : token,
                            user : user,
                            success : true
                        })
                    }
                    else {
                        res.json({
                            success : false
                        })
                    }
                });
            }
            else {
                res.json({
                    success : false
                })
            }
        })
    });

    app.post('/api/user/profile', Auth, function(req, res, next) {
        var token = req.headers["access-token"];
        jwt.verify(token, appSecret, function(err, decoded) {
            User.findOne({ email : decoded.data } , function(err, user) {
                var existedUser = user
                var email = req.body.email
                var password = req.body.password
                var firstname = req.body.firstname
                var lastname = req.body.lastname

                bcrypt.hash(password, saltRounds)
                    .then(function(hash) {
                        existedUser.set({
                            firstname : firstname,
                            lastname : lastname,
                            email : email,
                            password : hash
                        })
                        return existedUser.save()
                    })
                    .then(() => {
                        var token = jwt.sign( { data : email }, appSecret, { expiresIn : 60*60*24 } );
                        res.json({
                            token : token,
                            user : existedUser,
                            success : true
                        })
                    })
                    .catch((err) => next(err));
                    })
                })
    });
};
