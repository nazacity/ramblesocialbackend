'use strict';

const bcrypt = require('bcrypt');
const { provinceDict } = require('../utils/constants/provinces');
const axios = require('axios');
const config = require('../utils/config');

const AbstractService = require('./abstract');

class SocialService extends AbstractService {
  async createSocialCategory(data) {
    return this.models.SocialCategory.create(data);
  }

  async getSocialCategories() {
    return this.models.SocialCategory.find({});
  }

  async getUserSocialCategories() {
    return this.models.SocialCategory.find({
      state: 'active',
    });
  }

  //   async deleteBlogCategory(id) {
  //     return this.models.BlogCategory.findByIdAndRemove(id);
  //   }

  async changeSocialCategoryState(id, data) {
    return this.models.SocialCategory.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  }
}

module.exports = SocialService;
