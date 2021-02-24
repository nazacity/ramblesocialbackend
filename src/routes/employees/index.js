'use strict';

const Joi = require('joi');
const express = require('express');
const router = express.Router();

const {
  constant: permission,
  enum: permissionEnum,
} = require('../../utils/constants/employee');
const { standardize } = require('../../utils/request');
const { UserService, ActivityService, BlogService } = require('../../services');

const createActivity = standardize(async (req, res) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    activity_picture_url: Joi.string().required(),
    title: Joi.string().required(),
  });

  const data = Joi.attempt(req.body, schema);

  const activity = await ActivityService.createActivity(data);

  res.status(200).send({
    status: 200,
    data: activity,
  });
}, permission.ADMIN);

const createBlogCategory = standardize(async (req, res) => {
  const schema = Joi.object({
    title_th: Joi.string().required(),
    title_en: Joi.string().required(),
    picture_url: Joi.string().required(),
  });

  const data = Joi.attempt(req.body, schema);

  const blogCategory = await BlogService.createBlogCategory(data);

  res.status(200).send({
    status: 200,
    data: blogCategory,
  });
}, permission.ADMIN);

const deleteBlogCategory = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  const blogCategory = await BlogService.deleteBlogCategory(id);

  res.status(200).send({
    status: 200,
    data: blogCategory,
  });
}, permission.ADMIN);

const createBlog = standardize(async (req, res) => {
  const schema = Joi.object({
    url: Joi.string().required(),
    description: Joi.string().required(),
    picture_url: Joi.string().required(),
    blog_category: Joi.string().required(),
  });

  const data = Joi.attempt(req.body, schema);

  const blogCategory = await BlogService.createBlog(data);

  res.status(200).send({
    status: 200,
    data: blogCategory,
  });
}, permission.ADMIN);

const changeBlogCategoryState = standardize(async (req, res) => {
  const schema = Joi.object({
    state: Joi.string().required(),
  });

  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  const data = Joi.attempt(req.body, schema);

  const blogCategory = await BlogService.changeBlogCategoryState(id, data);

  res.status(200).send({
    status: 200,
    data: blogCategory,
  });
}, permission.ADMIN);

const changeBlogState = standardize(async (req, res) => {
  const schema = Joi.object({
    state: Joi.string().required(),
  });

  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  const data = Joi.attempt(req.body, schema);

  const blog = await BlogService.changeBlogState(id, data);

  res.status(200).send({
    status: 200,
    data: blog,
  });
}, permission.ADMIN);

router.post('/createactivity', createActivity);
router.post('/createblogcategory', createBlogCategory);
router.delete('/blogcategory/:id', deleteBlogCategory);
router.post('/changeblogcategorystate/:id', changeBlogCategoryState);
router.post('/changeblogstate/:id', changeBlogState);
router.post('/createblog', createBlog);

module.exports = router;
