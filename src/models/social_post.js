'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const socialPostStateEnum = require('../utils/constants/activity').social_post;

const social_post = new Schema(
  {
    pictures: [
      {
        picture_url: { type: String },
      },
    ],
    social_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Social_Category',
    },
    likers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    social_post_comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Social_Post_Comment',
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: { type: String, require: true },
    state: {
      type: String,
      enum: socialPostStateEnum,
      required: true,
      default: 'active',
    },
  },
  { timestamps: true }
);

const Social_Post = mongoose.model('Social_Post', social_post);

module.exports = Social_Post;
