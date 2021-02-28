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
    })
      .populate({
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      })
      .populate({
        path: 'social_post_comments',
        populate: {
          path: 'user',
          select: {
            display_name: 1,
            user_picture_url: 1,
          },
        },
      });
  }

  async getPost(id) {
    return this.models.SocialPost.findById(id)
      .populate({
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      })
      .populate({
        path: 'social_post_comments',
        populate: {
          path: 'user',
          select: {
            display_name: 1,
            user_picture_url: 1,
          },
        },
      });
  }

  async likeSocialCategoryPost(id, userId) {
    const post = await this.models.SocialPost.findById(id);
    const likers = [...post.likers, userId];
    const likeCount = post.likeCount + 1;
    const newPost = await this.models.SocialPost.findByIdAndUpdate(
      id,
      {
        $set: {
          likers: likers,
          likeCount: likeCount,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: 'user',
      select: {
        display_name: 1,
        user_picture_url: 1,
      },
    });

    return newPost;
  }

  async unlikeSocialCategoryPost(id, userId) {
    const post = await this.models.SocialPost.findById(id);
    const likers = post.likers.filter((item) => item.toString() !== userId);
    const likeCount = post.likeCount - 1;
    const newPost = await this.models.SocialPost.findByIdAndUpdate(
      id,
      {
        $set: {
          likers: likers,
          likeCount: likeCount,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: 'user',
      select: {
        display_name: 1,
        user_picture_url: 1,
      },
    });

    return newPost;
  }

  async commentSocialPost(id, data) {
    const comment = await this.models.SocialPostComment.create(data);
    const post = await this.models.SocialPost.findById(id);
    const social_post_comments = [comment._id, ...post.social_post_comments];
    const newPost = await this.models.SocialPost.findByIdAndUpdate(
      id,
      {
        $set: {
          social_post_comments: social_post_comments,
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      })
      .populate({
        path: 'social_post_comments',
        populate: {
          path: 'user',
          select: {
            display_name: 1,
            user_picture_url: 1,
          },
        },
      });
    return newPost;
  }
}

module.exports = SocialService;
