'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const blogCategoryStateEnum = require('../utils/constants/activity')
  .blog_category;

const blog_category = new Schema(
  {
    title_th: { type: String, require: true },
    title_en: { type: String, require: true },
    picture_url: { type: String, require: true },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    state: {
      type: String,
      enum: blogCategoryStateEnum,
      required: true,
      default: 'deactive',
    },
  },
  { timestamps: true }
);

const Blog_Category = mongoose.model('Blog_Category', blog_category);

module.exports = Blog_Category;
