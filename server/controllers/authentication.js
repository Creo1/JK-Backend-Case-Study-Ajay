'use strict'
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Service from '../models/services';
import { setUserInfo, getRole } from '../services/helpers';
import config from '../config';
import bcrypt from 'bcrypt-nodejs';


// Generate JWT token
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 9000 // in seconds
  });
}


// Login Route for industry 
exports.login = function (req, res, next) {
User.findOne({
    email: req.body.email  //body is the property of body-parser
  }, function(err, user) {
    if (err) throw err;


    if (!user) {
      res.status(401).send({success: false, msg: 'We are sorry. We do not recognise the email address or password. Please try again.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {

          // if user is found and password is right create a token
          const userInfo = setUserInfo(user);
          res.status(200).json({
            token: `JWT ${generateToken(userInfo)}`,
            user: user
          });
        } else {
          res.status(401).send({success: false, message: 'We are sorry. We do not recognise the email address or password. Please try again.'});
        }
      });
    }
  });

};

// generate random strings
function generateStrings(string, number) {
  
let array=[];
for(let j=0; j<number;j++){
 let text = "";
  for (let i = 0; i < 6; i++)
    text += string.charAt(Math.floor(Math.random() * string.length));
  array.push(text);

}
  

  return array;
}


// return random strings
exports.randomStrings = function (req, res, next){

  const string = req.body.string;
  const number= req.body.number;

   if (string!==null && typeof string==='string' && typeof number==='number') { 
    return res.status(401).json({ success: 'true',message:'Strings generated successfully',data:generateStrings(string,number), timestamp:new Date().getTime(),path:'localhost:3000/api/users/5ad1a0f3b34a9e191017c0d' }); 
  }
  else
  {
    return res.status(401).json({ success: 'false',message:'invalid parameter',data:'undefined', timestamp:new Date().getTime(),path:'localhost:3000/api/users/5ad1a0f3b34a9e191017c0d' }); 
}

};


// get user details

exports.getUser = function (req, res, next){

  const user_id = req.params.user_id;

   if (req.user._id.toString() !== user_id) { 
    return res.status(401).json({ success: 'false',message:'You are unauthorized user',data:'undefined', timestamp:new Date().getTime(),path:'localhost:3000/api/users/5ad1a0f3b34a9e191017c0d' }); 
  }
 
  User.findById(user_id,{password:0}, (err, user) => {
    if (err) {
      res.status(400).json({ success: 'false',message:'We do not find any user with this user_id',data:'undefined', timestamp:new Date().getTime(),path:'localhost:3000/api/users/{user_id}' });
      return next(err);
    }


    return res.status(200).json({  success: 'true',message:'We got user with this user_id',data:user, timestamp:new Date().getTime(),path:'localhost:3000/api/users/{user_id}' });
  });

};



// Registration for user
exports.register = function (req, res, next) {
  
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email=req.body.email;
  const password=req.body.password;

  const gender = req.body.gender;
  const companyName = req.body.companyName;
  const jobTitle=req.body.jobTitle;

  const university = req.body.university;
  const skill = req.body.skill;
  

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email}, (err, existingUser) => {
    if (err) { return next(err); }

      // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email address already registered.' });
    }


  

 // If email is unique and password was provided, create account
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      gender,
      companyName,
      jobTitle,
      university,
      skill
    });

    user.save((err, user) => {
      if (err) { return next(err);
    }

        // Respond with JWT if user was created

      const userInfo = setUserInfo(user);

      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};

