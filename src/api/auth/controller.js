import User from "../../api/user/model";
import { success, fail, notFound } from "../../services/responses";

import {
  hashPassword,
  findEmail,
  comparePasswords,
} from "../../services/helpers";

import jwt from "jsonwebtoken";
import { jwtSecret, getToken, encrypt } from "../../services/jwt";

// / Authorize to access user protected route
export function isValidUser(req, res, next) {
  const accessToken = getToken(req);
  let filter;
  if (!req.params) {
    return fail(res, 403, "Authentication failed: Invalid request parameters.");
  }
  if (!accessToken) {
    return fail(res, 403, "Authencation faied: Undefined token.");
  }
  try {
    const {
      payload: { id, email },
    } = jwt.verify(accessToken, jwtSecret);
    if (email) {
      filter = { email };
    }
    return User.findOne(filter)
      .select({ email: true, firstName: true, lastName: true })
      .exec()
      .then((user) => {
        if (!user) {
          return notFound(
            res,
            `User with email ${email} not found in database`
          );
        }
        res.locals.userId = id;
        res.locals.userType = "user";
        res.locals.userEmail = email;
        return next();
      });
  } catch (error) {
    return fail(res, 401, "User verication failed, please login");
  }
}

// Sigup user route
export async function emailSignup(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return fail(res, 401, "Request should have an Email and Password");
  }
  if (!req.params) {
    return fail(res, 403, "Authentication Failed: invalid request parameters.");
  }

  let user;

  try {
    user = (await findEmail(User, email)) || {};
  } catch (err) {
    return fail(
      res,
      500,
      `Error finding user with email ${email}. ${err.message}`
    );
  }

  if (user && email === user.email) {
    return fail(res, 500, `User with email already exist. ${email}`);
  }
  return hashPassword(password)
    .then((hash) => {
      const newUser = new User({
        email: req.body.email,
        password: hash,
      });
      return newUser
        .save()
        .then((saved) =>
          success(res, 200, saved, "new User record has been created")
        )
        .catch((err) => fail(res, 500, `Error creating user. ${err}`));
    })
    .catch((err) =>
      fail(res, 500, `Error encrypting user password. ${err.message}`)
    );
}

// Login user route
export async function emailLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return fail(res, 401, "Request should have an Email and Password");
  }
  let currentUser;
  let user;
  try {
    user = (await findEmail(User, email)) || {};
  } catch (err) {
    return fail(
      res,
      500,
      `Error finding user with email ${email}. ${err.message}`
    );
  }
  if (!user.email) {
    return fail(res, 500, `Could not find user with email ${email}`);
  }
  const match = await comparePasswords(password, user.password);
  // //////////////////////////////////////////////////
  // Step 4: Create JWT
  // //////////////////////////////////////////////////
  if (match) {
    return user
      .save()
      .then((result) => {
        currentUser = result;
        return new Promise((resolve, reject) => {
          jwt.sign(
            {
              payload: {
                id: result.id,
                email,
              },
            },
            jwtSecret,
            (err, token) => {
              if (err) reject(err);
              resolve(token);
            }
          );
        });
      })
      .then((accessToken) => {
        try {
          const encrypted = encrypt(accessToken);
          return success(
            res,
            200,
            { accessToken: encrypted, id: currentUser.id },
            "Authentication successful!"
          );
        } catch (err) {
          return fail(res, 401, "Unable to generate an access token");
        }
      })
      .catch((err) => {
        return fail(res, 500, "Unable to authenticate user", err);
      });
  }
}
