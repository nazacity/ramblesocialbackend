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

  async getSocialActivity(id) {
    return this.models.Activity.findById(id);
  }

  async createPostSocialActivity(data) {
    return this.models.ActivityPost.create(data);
  }

  async updatedSocialActivityPost(id, post_id) {
    const socialCategory = await this.models.Activity.findById(id);
    const post = [post_id, ...socialCategory.activity_posts];
    return await this.models.Activity.findByIdAndUpdate(
      id,
      {
        $set: {
          activity_posts: post,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: 'activity_posts',
      populate: {
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      },
    });
  }

  async getPosts(ids) {
    return this.models.ActivityPost.find({ _id: { $in: ids } }, null, {
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
        path: 'activity_post_comments',
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
    return this.models.ActivityPost.findById(id)
      .populate({
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      })
      .populate({
        path: 'activity_post_comments',
        populate: {
          path: 'user',
          select: {
            display_name: 1,
            user_picture_url: 1,
          },
        },
      });
  }

  async likeSocialActivityPost(id, userId) {
    const post = await this.models.ActivityPost.findById(id);
    const likers = [...post.likers, userId];
    const likeCount = post.likeCount + 1;
    const newPost = await this.models.ActivityPost.findByIdAndUpdate(
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

  async unlikeSocialActivityPost(id, userId) {
    const post = await this.models.ActivityPost.findById(id);
    const likers = post.likers.filter((item) => item.toString() !== userId);
    const likeCount = post.likeCount - 1;
    const newPost = await this.models.ActivityPost.findByIdAndUpdate(
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
    const comment = await this.models.ActivityPostComment.create(data);
    const post = await this.models.ActivityPost.findById(id);
    const activity_post_comments = [
      comment._id,
      ...post.activity_post_comments,
    ];
    const newPost = await this.models.ActivityPost.findByIdAndUpdate(
      id,
      {
        $set: {
          activity_post_comments: activity_post_comments,
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
        path: 'activity_post_comments',
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

module.exports = ActivityService;
