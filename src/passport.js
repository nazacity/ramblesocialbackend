'use strict';

const _ = require('lodash');
const passport = require('passport');
const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;
const jwt = require('jsonwebtoken');

const config = require('./utils/config');
const { User } = require('./models');
const axios = require('axios');

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
      await jwt.verify(token, config.jwt.secret, { issuer: config.jwt.issuer });
      const jwt_payload = jwt.decode(token);

      let user = await User.findOne({ _id: jwt_payload.sub }, { password: 0 });

      if (jwt_payload.type !== 'user') {
        done(null, false);
      }

      if (user) {
        done(null, user);
      } else {
        // done(null, false);

        const getUser = await axios.get(
          `${config.main.URL}/api/users/getuserbyjwt`,
          {
            headers: {
              authorization: req.headers.authorization,
            },
          }
        );

        if (getUser) {
          const newUser = await User.create({
            _id: getUser.data._id,
            display_name: getUser.data.display_name,
            user_picture_url: getUser.data.user_picture_url,
          });

          done(null, newUser);
        }
      }
    } catch (error) {
      return done(null, false, { message: 'Invalid Token.' });
    }
  })
);

passport.use(
  'employeeJwt',
  new CustomStrategy(async function (req, done) {
    const token = extractToken(req.headers);

    try {
      let res = await axios.get(
        `${config.main.URL}/api/employees/getemployeebyjwt`,
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
