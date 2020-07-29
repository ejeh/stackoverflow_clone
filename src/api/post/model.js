/**
 * @author Godfrey Ejeh
 * @description Creating the user account
 * @property {String} title post's title
 * @property {String} body post's body
 * @property {String} user post's user
 *
 *  */

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";

const PostSchema = new Schema(
  {
    title: { type: String, required: true, es_indexed: true },
    body: { type: String, required: true, es_indexed: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      es_indexed: true,
      es_select: "email",
    },
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

PostSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      email: this.title,
      body: this.body,
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
PostSchema.plugin(mongoosastic, {
  populate: [
    {
      path: "user",
      select: "email",
    },
  ],
});
const Post = mongoose.model("Post", PostSchema);

export const { ObjectId } = mongoose.Types;
export default Post;
