import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';


const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  

email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    trim: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },


  password: {
    type: String,
    required: true,
    trim: true

  },
  firstName: {
    type: String,
    trim: true

  },
   lastName: {
    type: String,
    trim: true

  },
  gender: {
    type: String,
    trim: true

  },
  companyName: {
    type: String,
    trim: true

  },
  jobTitle: {
    type: String,
    trim: true

  },
  university: {
    type: String,
    trim: true

  },
  skill: {
    type: String,
    trim: true

  }



},
{
  timestamps: true
});

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
});
};


module.exports = mongoose.model('User', UserSchema);
