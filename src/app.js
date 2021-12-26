const fastify = require('fastify');

/**
 * Build an instance of fastify which can be used to run as a server using .listen
 * or tested using .inject
 * @param {FastifyServerOptions} opts Options to configure fastify
 * @returns {FastifyInstance} Instance of the fastify application
 */
function build(opts = {}) {
  // Create an instance of the fastify app
  const app = fastify(opts);

  // Registering the routes plugin which will handle the requests based
  // on the http url pattern
  app.register(require('./routes'));

  // Return the instance of the app
  return app;
}

module.exports = build;