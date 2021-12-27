module.exports = async function routes(fastify, opts) {
  // Register a simple route on the root and send 200 OK response.
  // This will act like our health check endpoint to know if the server is running.
  //
  // Pro Tip: You could make this better health check endpoint by responding with
  // load, memory or storage capacity. Or you could respond with a schema of your API
  fastify.get("/", async function () {
    return this.mongo.db.command({ ping: 1 });
  });

  // A post endpoint to CREATE a document
  fastify.post("/doc", require("./controller/create"));

  // A delete endpoint to DELETE a document
  fastify.delete("/doc/:id", require("./controller/delete"));

  // A get endpoint to READ a document
  fastify.get("/doc/:id", require("./controller/get"));

  // A patch endpoint to UPDATE a document
  // Note: Unlink the get endpoint, when updating the document we can only update
  // the shadow created for us, therefore our endpoint also need to pass the shadow id
  fastify.patch("/doc/:id/shadow/:sid", require("./controller/update"));
};
