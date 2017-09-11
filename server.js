'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Good = require('good');
const Inert = require('inert');


// Create server with public/ as starting directory
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});
server.connection({
  port: 3000,
  host: 'localhost'
});


// Routes
// server.route({
//   method: 'GET',
//   path: '/',
//   handler: function (request, reply) {
//     return reply('Hello World!');
//   }
// });

server.route({
  method: 'GET',
  path: '/{name}',
  handler: function (request, reply) {
    reply('Hello, I can\'t find the page for ' + encodeURIComponent(request.params.name) + '!');
  }
});


// Static page
// server.register(require('inert'), (err) => {
//   if (err) {
//     throw err;
//   }
//
//   server.route({
//     method: 'GET',
//     path: '/hello',
//     handler: function (request, reply) {
//       reply.file('./public/hello.html');
//     }
//   });
// });


// Start server with:
// - Access logging (Good)
// - Static pages (Inert)
server.register([{
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
}, {
  register: Inert
}], (err) => {
  if (err) {
    throw err; // Error loading plugins
  }

  // Route in traditional form
  server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
      reply.file('hello.html');
    }
  });

  // Route using file handler
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true,
          defaultExtension: 'html'
        }
    }
  });

  // Start server
  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });

});
