'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const activity_post_comment = new Schema(
  {
    text: { type: String, require: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Activity_Post_Comment = mongoose.model(
  'Activity_Post_Comment',
  activity_post_comment
);

module.exports = Activity_Post_Comment;
