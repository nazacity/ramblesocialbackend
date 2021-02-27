'use strict';

const bcrypt = require('bcrypt');
const { provinceDict } = require('../utils/constants/provinces');
const axios = require('axios');
const config = require('../utils/config');

const AbstractService = require('./abstract');

class BlogService extends AbstractService {
  async createBlogCategory(data) {
    return this.models.BlogCategory.create(data);
  }

  async getBlogCategories() {
    return this.models.BlogCategory.find({}).populate({ path: 'blogs' });
  }

  async deleteBlogCategory(id) {
    return this.models.BlogCategory.findByIdAndRemove(id);
  }

  async changeBlogCategoryState(id, data) {
    return this.models.BlogCategory.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
      }
    ).populate({ path: 'blogs' });
  }

  async changeBlogState(id, data) {
    return this.models.Blog.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  }

  async createBlog(data) {
    const blog = await this.models.Blog.create(data);
    const blogCategory = await this.models.BlogCategory.findById(
      data.blog_category
    );
    await this.models.BlogCategory.findByIdAndUpdate(data.blog_category, {
      $set: {
        blogs: [...blogCategory.blogs, blog._id],
      },
    });
    return blog;
  }

  async getBlogCategories() {
    const blogCategories = await this.models.BlogCategory.find({}).populate({
      path: 'blogs',
      options: {
        limit: 5,
        sort: { createdAt: -1 },
      },
    });

    return blogCategories;
  }

  async getUserBlogCategories() {
    const blogCategories = await this.models.BlogCategory.find({
      state: 'active',
    }).populate({
      path: 'blogs',
      options: {
        limit: 5,
        sort: { createdAt: -1 },
      },
    });

    return blogCategories;
  }

  async likeBlog(id, userId) {
    const blog = await this.models.Blog.findById(id);
    const likers = [...blog.likers, userId];
    const likeCount = blog.likeCount + 1;
    const newBlog = await this.models.Blog.findByIdAndUpdate(id, {
      $set: {
        likers: likers,
        likeCount: likeCount,
      },
    });
    return 'Successed';
  }

  async unlikeBlog(id, userId) {
    const blog = await this.models.Blog.findById(id);
    const likers = blog.likers.filter((item) => item.toString() !== userId);
    const likeCount = blog.likeCount - 1;
    const newBlog = await this.models.Blog.findByIdAndUpdate(id, {
      $set: {
        likers: likers,
        likeCount: likeCount,
      },
    });
    return 'Successed';
  }

  async getBlog(id) {
    const blog = await this.models.Blog.findById(id).populate({
      path: 'blog_comments',
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      },
    });

    return blog;
  }

  async createBlogComment(id, data) {
    const blog = await this.models.Blog.findById(id);
    const comment = await this.models.BlogComment.create(data);
    const newBlog = await this.models.Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          blog_comments: [...blog.blog_comments, comment._id],
        },
      },
      { new: true }
    ).populate({
      path: 'blog_comments',
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: 'user',
        select: {
          display_name: 1,
          user_picture_url: 1,
        },
      },
    });

    return newBlog;
  }

  async getBlogs(id) {
    const blogs = await this.models.BlogCategory.findById(id).populate({
      path: 'blogs',
      options: {
        sort: { createdAt: -1 },
      },
    });

    return blogs;
  }
}

module.exports = BlogService;
