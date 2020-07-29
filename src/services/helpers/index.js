import bcrypt from "bcryptjs";

export const saltRounds = 10;
export async function hashPassword(plaintextPassword) {
  return bcrypt.hash(plaintextPassword, saltRounds);
}

export async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

export function findEmail(User, email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .select("+password")
      .exec((err, result) => {
        if (err) reject(err);
        return resolve(result);
      });
  });
}
