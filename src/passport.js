'use strict';

const _ = require('lodash');
const passport = require('passport');
const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;
const jwt = require('jsonwebtoken');

const config = require('./utils/config');
const { User } = require('./models');
const { default: axios } = require('axios');

function _calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (_id, done) {
  if (user) {
    done(null, user);
  }
  // try {
  //   const user = await User.findOne({ _id }, { password: 0 }).lean();
  //   return done(null, user);
  // } catch (err) {
  //   done(err);
  // }
});

const extractToken = (headers) => {
  if (/Bearer\s.+/.test(headers.authorization)) {
    return headers.authorization.substring(7);
  } else {
    return null;
  }
};

passport.use(
  'userJwt',
  new CustomStrategy(async function (req, done) {
    const token = extractToken(req.headers);

    try {
      let res = await axios.get(
        'http://localhost:5000/api/users/getuserbyjwt',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data) {
        done(null, res.data);
      } else {
        done(null, false);
      }
    } catch (error) {
      return done(null, false, { message: 'Invalid Token.' });
    }
  })
);

module.exports = passport;
