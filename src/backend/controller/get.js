const { ObjectID } = require("bson");

module.exports = async function (req) {
  const { id } = req.params,
    { user, client } = req.query;
  // 1. Find the flow
  // 2. Find and update the shadow
  const doc = await this.mongo.db
    .collection("doc")
    .findOne({ _id: ObjectID(id) }, { projection: { _id: 0 } });

  const { value: shadow } = await this.mongo.db
    .collection("doc")
    .findOneAndUpdate(
      {
        user,
        client,
        record: ObjectID(id),
      },
      {
        $set: {
          cv: 0,
          sv: 0,
          doc,
          updatedAt: new Date(),
          ro: false,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        projection: {
          _id: 1,
          cv: 1,
          sv: 1,
          ro: 1,
        },
      }
    );

  return { _id: id, doc, shadow };
};
