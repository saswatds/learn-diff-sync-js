const { ObjectID } = require("bson");

module.exports = async function (req) {
  // Extract the id from the url params and user and client from the query
  // The validation layer in fastify will ensure that they exist and are valid
  const { id } = req.params,
    { user, client } = req.query;


  // Get the document from the database without it's id
  const doc = await this.mongo.db
    .collection("doc")
    .findOne({ _id: ObjectID(id) }, { projection: { _id: 0 } });

  // Create a shadow copy of document in the shadow collection with the cv and sv
  // set to 0
  // Note: We use mongodb options to return the document after it has been updated
  // We also set upset to true to create the document if it does not exist already
  const { value: shadow } = await this.mongo.db
    .collection("shadow")
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
