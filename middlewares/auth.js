'use strict';

const jwt = require('jsonwebtoken');
// const config = require('../api/config/' + process.env.NODE_ENV);
const config = require('../api/config/development');
let bcrypt, salt;
bcrypt = require('bcrypt-nodejs');

// if (process.env.NODE_ENV === 'development') {
//     bcrypt = require('bcrypt-nodejs');
// } else {
//     bcrypt = require('bcrypt');
//     const saltRounds = 10;
//     salt = bcrypt.genSaltSync(saltRounds);
// }
const crypto = require('crypto-random-string');
const Joi = require('joi');
// The authentication controller.
var AuthController = {};
const userModel = require('../storage/models/users').userModel;

// Register a user.
AuthController.signUp = function(req, res) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        contact: Joi.string().required()
    }).options({
        stripUnknown: true
    });

    return Joi.validate(req.body, schema, function (err, value) {
        if (err) {
            return res.status(422).json(err.details[0].message);
        } else {
            const newUser = {
                email: value.email,
                firstName: value.firstName,
                lastName: value.lastName,
                contact: value.contact,
                createdBy: value.email,
                updatedBy: value.email,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            newUser.password = bcrypt.hashSync(value.password);

            // if (process.env.NODE_ENV === 'development') {
            //     newUser.password = bcrypt.hashSync(value.password);
            // } else {
            //     newUser.password = bcrypt.hashSync(value.password, salt);
            // }
            // Attempt to save the user
            console.log(newUser);
            const regUser = new userModel(newUser);
            userModel.findOne({
              email: value.email
            }, function (err, user) {
              if (err) return console.error(err);
              console.log(user);
              if (user) {
                return res.status(200).json({
                    success: false,
                    message: 'User with email address already exists'
                });
              } else {
                regUser.save(function (err, userResult) {
                  if (err) return console.error(err);
                  return res.status(200).json({
                      success: true,
                      message: `${value.email} account created successfully`,
                      email: userResult.email
                  });
                });
              }
            });
        }
    });  // err === null -> valid
}

// Compares two passwords.
function comparePasswords(password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function(error, isMatch) {
        if(error) {
            return callback(error);
        }
        return callback(null, isMatch);
    });
}

// Authenticate a user.
AuthController.authenticateUser = function(req, res) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }).options({
        stripUnknown: true
    });

    return Joi.validate(req.body, schema, function (err, value) {
        if (err) {
            return res.status(422).json(err.details[0].message);
        } else {
            const email = req.body.email,
                password = req.body.password,
                potentialUser = { where: { email: email } };
            return userModel.findOne({
              email: email
            }, function (err, user) {
              if (err) return console.error(err);
              console.log(user);
              if (user) {
                comparePasswords(password, user.password, function(error, isMatch) {
                    if(isMatch && !error) {
                        var token = jwt.sign(
                            { email: user.email },
                            config.keys.secret
                        );

                        return res.json({
                            success: true,
                            token: 'JWT ' + token,
                            message: 'Logged in successfully'
                        });
                    } else {
                        return res.status(200).json({
                            success: false,
                            message: 'Login failed'
                        });
                    }
                });
              } else {
                return res.status(200).json({
                    success: false,
                    message: 'User with email does not exist'
                });
              }
            })
        }
    });
}

AuthController.getUsers = function(req, res) {
  return userModel.find(function (err, users) {
    if (err) return console.error(err);
    if (users) {
      console.log(users);
      return res.json({
          success: true,
          users: users,
          currentUser: req.user
      });
    } else {
      return res.status(200).json({
          success: false,
          message: 'Failed'
      });
    }
  });
}

module.exports = AuthController;
