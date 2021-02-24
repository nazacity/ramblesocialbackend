'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const activtyPostStateEnum = require('../utils/constants/activity')
  .activity_post;

const activity_post = new Schema(
  {
    pictures: [
      {
        picture_url: { type: String },
      },
    ],
    activity_post_comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity_Post_Comment',
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: { type: String, require: true },
    state: {
      type: String,
      enum: activtyPostStateEnum,
      required: true,
      default: 'active',
    },
  },
  { timestamps: true }
);

const Activity_Post = mongoose.model('Activity_Post', activity_post);

module.exports = Activity_Post;
