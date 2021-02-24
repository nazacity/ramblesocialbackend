'use strict';

const mongoose = require('mongoose');
const config = require('../utils/config');

mongoose.connect(config.mongo.URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

module.exports = {
  Activity: require('./activity'),
  ActivityPostComment: require('./activity_post_comment'),
  ActivityPost: require('./activity_post'),
  BlogCategory: require('./blog_category'),
  BlogComment: require('./blog_comment'),
  Blog: require('./blog'),
  SocialCategory: require('./social_category'),
  SocialPostComment: require('./social_post_comment'),
  SocialPost: require('./social_post'),
  User: require('./user'),
};
