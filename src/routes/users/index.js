'use strict';

const Joi = require('joi');
const express = require('express');
const router = express.Router();
const config = require('../../utils/config');
const axios = require('axios');

const { upload, deleteFile } = require('../../utils/spacesutil');

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

const postSocialCategories = standardize(async (req, res) => {
  upload(req, res, async function (error) {
    if (error) {
      console.log(error);
      return res.status(400).json({ data: 'Something went wrong' });
    } else {
      const pictures = req.files.map((item) => {
        return { picture_url: item.location };
      });

      const data = {
        user: req.user.id,
        pictures: pictures,
        text: req.body.text,
        social_category: req.body.social_category,
      };

      const newPost = await SocialService.createPostSocialCategory(data);

      const updatedSocialCategory = await SocialService.updatedSocialCategoryPost(
        req.body.social_category,
        newPost._id
      );

      res.json({
        status: 200,
        data: newPost,
      });
    }
  });
});

const getSocialCategory = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  const socialCategory = await SocialService.getSocialCategoryPost(id);

  res.json({
    status: 200,
    data: socialCategory,
  });
});

const getPosts = standardize(async (req, res) => {
  const schema = Joi.array();

  const ids = Joi.attempt(req.body, schema);

  const posts = await SocialService.getPosts(ids);

  res.json({
    status: 200,
    data: posts,
  });
});

const likeSocialCategoryPost = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);
  res.json({
    status: 200,
    data: await SocialService.likeSocialCategoryPost(id, req.user.id),
  });
});

const unlikeSocialCategoryPost = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);
  res.json({
    status: 200,
    data: await SocialService.unlikeSocialCategoryPost(id, req.user.id),
  });
});

const commentSocialPost = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  const schema = Joi.object({
    text: Joi.string().required(),
    user: Joi.string().required(),
  });

  const data = Joi.attempt({ ...req.body, user: req.user.id }, schema);
  res.json({
    status: 200,
    data: await SocialService.commentSocialPost(id, data),
  });
});

const getPost = standardize(async (req, res) => {
  const paramSchema = Joi.object({
    id: Joi.string().required(),
  });

  const { id } = Joi.attempt(req.params, paramSchema);

  res.json({
    status: 200,
    data: await SocialService.getPost(id),
  });
});

router.get('/getsocialcategories', getSocialCategories);
router.post('/postsocialcategories', postSocialCategories);
router.get('/getsocialcategory/:id', getSocialCategory);
router.post('/getposts', getPosts);
router.get('/likesocialcatgorypost/:id', likeSocialCategoryPost);
router.get('/unlikesocialcatgorypost/:id', unlikeSocialCategoryPost);
router.get('/getpost/:id', getPost);
router.post('/commentsocialpost/:id', commentSocialPost);

module.exports = router;
