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
}

module.exports = BlogService;
