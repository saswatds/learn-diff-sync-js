// Require the fastify framework and instantiate.
// Pro Tip: Set the logger option to true to enable logging
// requests that hit our server. This will help with debugging.
// More Options: https://www.fastify.io/docs/latest/Reference/Server/
const server = require("./src/app")({
  logger: {
    prettyPrint: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});

// Start server to make it listen on port 3000
server.listen(3000, (err, address) => {
  if (err) {
    // If there was an error while starting the server, then print the error and
    // exit with process code 1
    server.log.error(err);
    process.exit(1);
  }

  // Server is now listening on ${address}
});
