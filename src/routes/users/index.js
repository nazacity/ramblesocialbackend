'use strict';

const Joi = require('joi');
const express = require('express');
const router = express.Router();
const config = require('../../utils/config');
const axios = require('axios');

const { standardize } = require('../../utils/request');
const { UserService } = require('../../services');

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

router.post('/edituser', editUser);
router.get('/getuserbyjwt', getUserByJwt);

module.exports = router;
