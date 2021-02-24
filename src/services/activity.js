'use strict';

const bcrypt = require('bcrypt');
const { provinceDict } = require('../utils/constants/provinces');
const axios = require('axios');
const config = require('../utils/config');

const AbstractService = require('./abstract');

class ActivityService extends AbstractService {
  async createActivity(data) {
    return this.models.Activity.create(data);
  }
}

module.exports = ActivityService;
