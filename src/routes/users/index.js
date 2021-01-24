'use strict';

const Joi = require('joi');
const express = require('express');
const router = express.Router();
const config = require('../../utils/config');
const axios = require('axios');

const { standardize } = require('../../utils/request');
const {} = require('../../services');

const getUserByJwt = standardize(async (req, res) => {
  return res.json(req.user);
});

router.get('/getuserbyjwt', getUserByJwt);

module.exports = router;
