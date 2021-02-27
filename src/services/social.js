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

  async createPostSocialCategory(data) {
    return this.models.SocialPost.create(data);
  }

  async updatedSocialCategoryPost(id, post_id) {
    const socialCategory = await this.models.SocialCategory.findById(id);
    const post = [post_id, ...socialCategory.social_posts];
    return await this.models.SocialCategory.findByIdAndUpdate(
      id,
      {
        $set: {
          social_posts: post,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: 'social_posts',
      populate: {
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      },
    });
  }

  async getSocialCategoryPost(id) {
    return this.models.SocialCategory.findById(id);
  }

  async getPosts(ids) {
    return this.models.SocialPost.find({ _id: { $in: ids } }, null, {
      sort: { createdAt: -1 },
    }).populate({
      path: 'user',
      select: {
        display_name: 1,
        user_picture_url: 1,
      },
    });
  }
}

module.exports = SocialService;
