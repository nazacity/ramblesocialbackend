'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const { user_state, user_gender } = require('../utils/constants/user');

const user = new Schema({
  // personal information
  display_name: { type: String, required: true },
  user_picture_url: { type: String },
  state: { type: String, enum: user_state, required: true, default: 'active' },
  activity_posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity_Post',
    },
  ],
});

user.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', user);

module.exports = User;
