'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const {
  user_state,
  user_gender,
  blood_type,
} = require('../utils/constants/user');

const user = new Schema({
  username: { type: String, required: true, unqiue: true },
  password: { type: String, required: true },

  // personal information
  display_name: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  birthday: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: user_gender, required: true },
  blood_type: { type: String, enum: blood_type, required: true },
  idcard: { type: String, required: true },
  user_picture_url: { type: String, required: true },
  user_background_picture_url: { type: String },
  device_token: { type: String },
  lineId: { type: String },

  state: { type: String, enum: user_state, required: true, default: 'active' },

  emergency_contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergency_Contact',
    },
  ],
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
  ],
  user_posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User_Post',
    },
  ],
  user_records: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User_Year_Record',
    },
  ],
  user_activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User_Activity',
    },
  ],
});

user.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', user);

module.exports = User;
