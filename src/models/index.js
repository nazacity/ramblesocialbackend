'use strict';

const mongoose = require('mongoose');
const config = require('../utils/config');

mongoose.connect(config.mongo.URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

module.exports = {
  User: require('./user'),
};
