'use strict';

const Boom = require('@hapi/boom');
const { User } = require('../models');

const profileHandler = {
  // Get user profile
  getProfile: async (request, h) => {
    try {
      const userId = request.auth.credentials.id;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'phoneNumber', 'address', 'interest']
      });

      if (!user) {
        throw Boom.notFound('User not found');
      }

      return h.response(user).code(200);
    } catch (error) {
      throw Boom.boomify(error);
    }
  },

  // Update user profile
  updateProfile: async (request, h) => {
    try {
      const userId = request.auth.credentials.id;
      const { name, phoneNumber, address, interest } = request.payload;

      const user = await User.findByPk(userId);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      await user.update({
        name,
        phoneNumber,
        address,
        interest
      });

      return h.response({
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        interest: user.interest
      }).code(200);
    } catch (error) {
      throw Boom.boomify(error);
    }
  },

  // Delete user profile
  deleteProfile: async (request, h) => {
    try {
      const userId = request.auth.credentials.id;
      const user = await User.findByPk(userId);

      if (!user) {
        throw Boom.notFound('User not found');
      }

      await user.destroy();
      return h.response().code(204);
    } catch (error) {
      throw Boom.boomify(error);
    }
  }
};

module.exports = profileHandler;
