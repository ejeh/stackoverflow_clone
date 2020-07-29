import Answer from "../answer/model";
import { fail, success } from "../../services/responses";
import esClient from "../../services/elasticsearch";

export const search = (req, res) => {
  const { q } = req.query || {};
  if (!q) return fail(res, 422, `Why incorrect query string ${q}?`);
  const search = async function search(index, body) {
    return await esClient.search({ index: index, body: body });
  };
  let body = {
    query: {
      multi_match: {
        query: q,
        fields: ["text", "user"],
        fuzziness: "AUTO",
      },
    },
    _source: ["user", "text", "post"],
  };
  search("answers", body)
    .then(async (results) => {
      console.log("result", results.body.hits);
      if (!results) {
        return fail(res, 500, "No search result found");
      }
      const result = results.body.hits.hits.map((source) => {
        return source._source;
      });
      success(res, 200, result, "retrieving record(s) was successfully!");
    })
    .catch((err) =>
      fail(res, 500, `Error retrieving record(s).\r\n${err.message}`)
    );
};

export const create = (req, res) => {
  const data = req.body;
  const { userId } = res.locals;
  const { postId } = req.params;

  if (!data.text) {
    return fail(res, 422, "Body cannot be enter and must be alphanumeric");
  }

  const newObject = {};
  newObject.user = userId;
  newObject.post = postId;

  if (data.text) newObject.text = data.text;

  const record = new Answer(newObject);

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
        "New Answer has been created successfully"
      );
    })
    .catch((err) => {
      return fail(
        res,
        500,
        `An error occured while trying to create a answer ${err.message}`
      );
    });
};
