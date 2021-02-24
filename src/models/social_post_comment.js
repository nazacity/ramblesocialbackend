'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const social_post_comment = new Schema(
  {
    text: { type: String, require: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Social_Post_Comment = mongoose.model(
  'Social_Post_Comment',
  social_post_comment
);

module.exports = Social_Post_Comment;
