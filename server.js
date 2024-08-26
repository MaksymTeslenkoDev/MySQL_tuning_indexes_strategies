'use strict';

require('dotenv').config();
const fastify = require('fastify');
const path = require('path');
const fastifyAutoload = require('@fastify/autoload');

const APP_PATH = path.join(process.cwd(), './')

const port = 3000;
const host = '0.0.0.0';

const app = fastify();
app.listen({ port, host });

app.register(fastifyAutoload, {
  dir: `${APP_PATH}/routes`,
});

console.log("application is running on port 3000");
