'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const db = require('./config/database');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register JWT plugin
  await server.register(Jwt);

  // Configure JWT authentication strategy
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || 'rahasia123',
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 14400, // 4 hours
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });

  server.auth.default('jwt');

  // Register all routes including forgot/reset password
  server.route([
    ...authRoutes,
    ...profileRoutes,
    ...forgotPasswordRoutes,
    ...resetPasswordRoutes,
  ]);

  // Test database connection
  try {
    await db.authenticate();
    console.log('Database connected successfully.');

    // Sync database (create tables if they don't exist)
    await db.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();