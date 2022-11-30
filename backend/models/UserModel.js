const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please enter your first name'],
    minLength: [2, 'First name must be at least 2 characters.'],
    maxLength: [15, 'First name can not exeed 15 characters.'],
  },
  last_name: {
    type: String,
    required: [true, 'Please enter your last name'],
    minLength: [2, 'Last name must be at least 2 characters.'],
    maxLength: [15, 'Last name can not exeed 15 characters.'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address.'],
    validate: [validator.isEmail, 'Please enter a valid email address.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minLength: [8, 'Password must be at least 8 characters long.'],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Hash password
userSchema.pre('save', async function (next) {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// jwt for login
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
