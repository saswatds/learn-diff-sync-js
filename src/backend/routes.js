module.exports = async function routes(fastify, opts) {
  // Register a simple route on the root and send 200 OK response.
  // This will act like our health check endpoint to know if the server is running.
  // 
  // Pro Tip: You could make this better health check endpoint by responding with
  // load, memory or storage capacity. Or you could respond with a schema of your API
  fastify.get('/', async () => '200 OK')
}