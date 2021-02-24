'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const activtyPostStateEnum = require('../utils/constants/activity')
  .activity_post;

const activity = new Schema(
  {
    activity_picture_url: { type: String, require: true },
    activity_posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity_Post',
      },
    ],
    title: { type: String, require: true },
    rate_point: { type: Number, require: true, default: 0 },
    rator: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    state: {
      type: String,
      enum: activtyPostStateEnum,
      required: true,
      default: 'active',
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activity);

module.exports = Activity;
