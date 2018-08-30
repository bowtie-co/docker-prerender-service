#!/usr/bin/env node

if (process.env.AWS_BUCKET_NAME) {
  process.env.S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
}

var prerender = require('./lib');
var healthcheck = require('./healthcheck');

var server = prerender({
  workers: process.env.PRERENDER_NUM_WORKERS,
  iterations: process.env.PRERENDER_NUM_ITERATIONS,
  chromeFlags: [ '--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars' ]
});

server.use(healthcheck);

server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

if (process.env.BASIC_AUTH_USERNAME && process.env.BASIC_AUTH_PASSWORD) {
  server.use(prerender.basicAuth());
}

if (process.env.ALLOWED_DOMAINS) {
  server.use(prerender.whitelist());
}

if (process.env.BLACKLISTED_DOMAINS) {
  server.use(prerender.blacklist());
}

if (process.env.VERBOSE) {
  server.use(prerender.logger());
}

if (process.env.S3_BUCKET_NAME) {
  server.use(prerender.s3HtmlCache());
} else if (process.env.IN_MEMORY_CACHE) {
  server.use(prerender.inMemoryHtmlCache());
// }

server.start();
