module.exports = async function () {
  return this.mongo.db.collection("doc").find().toArray();
};
