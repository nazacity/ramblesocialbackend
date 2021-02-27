const Joi = require('joi');
const express = require('express');
const router = express.Router();
const config = require('../../utils/config');
const axios = require('axios');
const model = require('../../models');
const { UserService, BlogService, SocialService } = require('../../services');

const createUser = async (req, res) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    display_name: Joi.string(),
    user_picture_url: Joi.string().allow(null),
  });

  const user = Joi.attempt(req.body, schema);

  const createdUser = await UserService.createUser(user);

  res
    .status(201)
    .send({ status: 200, data: createdUser, message: 'Successed' });
};

const getBlogCategories = async (req, res) => {
  res
    .status(201)
    .send({ status: 200, data: await BlogService.getBlogCategories() });
};

router.post('/createuser', createUser);
router.get('/blogcategories', getBlogCategories);

const getSocialCategories = async (req, res) => {
  res
    .status(201)
    .send({ status: 200, data: await SocialService.getSocialCategories() });
};

router.get('/socialcategories', getSocialCategories);

module.exports = router;
