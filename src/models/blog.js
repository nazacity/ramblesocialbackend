'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const blogCategoryStateEnum = require('../utils/constants/activity')
  .blog_category;

const blog = new Schema(
  {
    url: { type: String, require: true },
    description: { type: String, require: true },
    picture_url: { type: String, require: true },
    likeCount: { type: Number, require: true, default: 0 },
    likers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    blog_comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog_Comment',
      },
    ],
    blog_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog_Category',
    },
    state: {
      type: String,
      enum: blogCategoryStateEnum,
      required: true,
      default: 'deactive',
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blog);

module.exports = Blog;
