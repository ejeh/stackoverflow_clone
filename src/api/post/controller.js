import Post from "../post/model";
import { fail, success } from "../../services/responses";

export const create = (req, res) => {
  const data = req.body;
  const { userId } = res.locals;
  if (!data.title) {
    return fail(res, 422, "Title cannot be enter and must be alphanumeric");
  }
  if (!data.body) {
    return fail(res, 422, "Body cannot be enter and must be alphanumeric");
  }

  const newObject = {};
  newObject.user = userId;

  if (data.title) newObject.title = data.title;
  if (data.body) newObject.body = data.body;

  const record = new Post(newObject);

  return record
    .save()
    .then((result) => {
      if (!result) {
        return fail(res, 404, "Error: not found newly created team");
      }
      return success(
        res,
        200,
        result,
        "New post has been created successfully"
      );
    })
    .catch((err) => {
      return fail(
        res,
        500,
        `An error occured while trying to create a post ${err.message}`
      );
    });
};
