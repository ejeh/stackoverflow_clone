/**
 * @author Godfrey Ejeh
 * @description Creating the user account
 * @property {String} text user's text
 * @property {String} post user's post
 * @property {String} user user's user
 *
 *  */

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";

const AnswerSchema = new Schema(
  {
    text: { type: String, required: true, es_indexed: true },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      es_indexed: true,
      es_select: "title body",
    },
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

AnswerSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      text: this.text,
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

AnswerSchema.plugin(mongoosastic, {
  populate: [
    {
      path: "post",
      select: "title body",
    },
  ],
  index: "answers",
});

const Answer = mongoose.model("Answer", AnswerSchema);

export const { ObjectId } = mongoose.Types;
export default Answer;
