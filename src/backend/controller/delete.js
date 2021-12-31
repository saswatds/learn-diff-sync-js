const { ObjectID } = require("bson");

module.exports = async function (req) {
  const { id } = req.params;
  return this.mongo.db.collection("doc").deleteOne({ _id: ObjectID(id) });
};
