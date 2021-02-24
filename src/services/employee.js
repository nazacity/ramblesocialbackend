'use strict';

const bcrypt = require('bcrypt');
const permission = require('../utils/constants/employee').constant;

const AbstractService = require('./abstract');

class EmployeeService extends AbstractService {
  checkPermission(user, permissionLevel) {
    if (permissionLevel === permission.ADMIN) {
      return user.permission === permission.ADMIN;
    } else if (permissionLevel === permission.EMPLOYEE) {
      return (
        user.permission === permission.ADMIN ||
        user.permission === permission.EMPLOYEE
      );
    } else {
      return true;
    }
  }
}

module.exports = EmployeeService;
