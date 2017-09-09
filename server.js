'use strict';

const Hapi = require('hapi');

// Create server
const server = new Hapi.Server();
server.connection({
  port: 3000,
  host: 'localhost'
});

// Routes
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    return reply('Hello World!');
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: function (request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
  }
})

// Start server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
