'use strict';

const bcrypt = require('bcrypt');

const AbstractService = require('./abstract');

class UserService extends AbstractService {
  listUsers(filter, skip, limit) {
    return this.models.User.find(
      {
        display_name: filter.display_name ? filter.display_name : { $ne: null },
        first_name: filter.first_name ? filter.first_name : { $ne: null },
        last_name: filter.last_name ? filter.last_name : { $ne: null },
        gender: filter.gender ? filter.gender : { $ne: null },
        age: {
          $gte: filter.min_age ? filter.min_age : 0,
          $lte: filter.max_age ? filter.max_age : 100,
        },
      },
      { password: 0 }
    )
      .skip(+skip)
      .limit(+limit);
  }

  async createUser(data) {
    return this.models.User.create(data);
  }

  async editUser(id, data) {
    // data = await this._preProcessedUser(data);
    return this.models.User.findOneAndUpdate(
      { _id: id },
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  }
}

module.exports = UserService;
