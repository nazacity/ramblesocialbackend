'use strict';

const Joi = require('joi');
const express = require('express');
const router = express.Router();
const config = require('../../utils/config');
const axios = require('axios');

const { standardize } = require('../../utils/request');
const { UserService, BlogService, SocialService } = require('../../services');

const getUserByJwt = standardize(async (req, res) => {
  return res.json(req.user);
});

const editUser = standardize(async (req, res) => {
  let schema;
  const request = { ...req.body };
  delete request.type;

  if (req.body.type === 'editUserPictureProfile') {
    schema = Joi.object({
      user_picture_url: Joi.string().required(),
    });
  } else if (req.body.type === 'display_name') {
    schema = Joi.object({
      display_name: Joi.string().required(),
    });
  }

  const user = Joi.attempt(request, schema);
  res.json({
    status: 200,
    data: await UserService.editUser(req.user.id, user),
  });
});

const getBlogCategories = standardize(async (req, res) => {
  res.json({
    status: 200,
    data: await BlogService.getUserBlogCategories(),
  });
});

const likeBlog = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);
  res.json({
    status: 200,
    data: await BlogService.likeBlog(id, req.user.id),
  });
});

const unlikeBlog = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);
  res.json({
    status: 200,
    data: await BlogService.unlikeBlog(id, req.user.id),
  });
});

const getBlog = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);
  res.json({
    status: 200,
    data: await BlogService.getBlog(id),
  });
});

const createBlogComment = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const schema = Joi.object({
    text: Joi.string().required(),
    user: Joi.string().required(),
  });

  const data = Joi.attempt({ ...req.body, user: req.user.id }, schema);

  const { id } = Joi.attempt(req.params, paramSchema);
  res.json({
    status: 200,
    data: await BlogService.createBlogComment(id, data),
  });
});

const getBlogs = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  res.json({
    status: 200,
    data: await BlogService.getBlogs(id),
  });
});

router.post('/edituser', editUser);
router.get('/getuserbyjwt', getUserByJwt);
router.get('/getblogcategories', getBlogCategories);
router.get('/likeblog/:id', likeBlog);
router.get('/unlikeblog/:id', unlikeBlog);
router.get('/getblog/:id', getBlog);
router.post('/createblogcomment/:id', createBlogComment);
router.get('/getblogs/:id', getBlogs);

const getSocialCategories = standardize(async (req, res) => {
  res.json({
    status: 200,
    data: await SocialService.getUserSocialCategories(),
  });
});

router.get('/getsocialcategories', getSocialCategories);

module.exports = router;
