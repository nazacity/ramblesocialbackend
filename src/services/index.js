'use strict';

const _ = require('lodash');
const config = require('../utils/config');
const models = require('../models');

const services = {
  UserService: require('./user'),
};

_.forEach(services, (service, key) => {
  services[key] = new service(models, services, config);
});

module.exports = services;
