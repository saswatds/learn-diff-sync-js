const fastify = require("fastify");
const path = require("path");

/**
 * Build an instance of fastify which can be used to run as a server using .listen
 * or tested using .inject
 * @param {import('fastify').FastifyServerOptions} opts Options to configure fastify
 * @returns {import('fastify').FastifyInstance} Instance of the fastify application
 */
function build(opts = {}) {
  // Create an instance of the fastify app
  const app = fastify(opts);

  app.register(require("fastify-static"), {
    root: path.join(__dirname, "..", "public"),
  });

  app.register(require("fastify-mongodb"), {
    forceClose: true,
    url: "mongodb://localhost/todo?replicaSet=rs0",
  });

  // Registering the routes plugin which will handle the requests based
  // on the http url pattern
  app.register(require("./backend/routes"), { prefix: "api" });

  // Return the instance of the app
  return app;
}

module.exports = build;
