'use strict';

const Hapi = require('hapi');
const Good = require('good');

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


// Static page
server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
      reply.file('./public/hello.html');
    }
  });
});

// Start server with access logging
server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {
  if (err) {
    throw err; // Something bad happened loading the plugin
  }

  // Start server
  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });

})
