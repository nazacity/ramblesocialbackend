'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const socialCategoryStateEnum = require('../utils/constants/activity')
  .social_category;

const social_category = new Schema(
  {
    title_th: { type: String, require: true },
    title_en: { type: String, require: true },
    picture_url: { type: String, require: true },
    social_posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Social_Post',
      },
    ],
    state: {
      type: String,
      enum: socialCategoryStateEnum,
      required: true,
      default: 'active',
    },
  },
  { timestamps: true }
);

const Social_Category = mongoose.model('Social_Category', social_category);

module.exports = Social_Category;
