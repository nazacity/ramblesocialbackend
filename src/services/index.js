'use strict';

const _ = require('lodash');
const config = require('../utils/config');
const models = require('../models');

const services = {
  ActivityService: require('./activity'),
  BlogService: require('./blog'),
  UserService: require('./user'),
  EmployeeService: require('./employee'),
};

_.forEach(services, (service, key) => {
  services[key] = new service(models, services, config);
});

module.exports = services;
