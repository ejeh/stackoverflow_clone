/**
 * @author Godfrey Ejeh
 * @description Creating the user account
 * @property {String} email user's email account
 * @property {String} password user's password
 *  */

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      max: 100,
      trim: true,
      required: true,
      es_indexed: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id;
      },
    },
  }
);

UserSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      email: this.email,
      updated: this.updated,
    };

    return full
      ? {
          ...view,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        }
      : view;
  },
};

UserSchema.plugin(mongoosastic);
const User = mongoose.model("User", UserSchema);

export const { ObjectId } = mongoose.Types;
export default User;
