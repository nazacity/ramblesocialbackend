'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const blog_comment = new Schema(
  {
    text: { type: String, require: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Blog_Comment = mongoose.model('Blog_Comment', blog_comment);

module.exports = Blog_Comment;
