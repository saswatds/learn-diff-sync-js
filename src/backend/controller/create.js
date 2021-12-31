module.exports = async function (req) {
  const col = this.mongo.db.collection("doc"),
    { insertedId } = await col.insertOne(req.body);

  return { id: insertedId };
};
