'use strict';

const Boom = require('@hapi/boom');
const { User } = require('../models');

const profileHandler = {
  // Get user profile
  getProfile: async (request, h) => {
    try {
      const userId = request.auth.credentials.id;
      console.log('Getting profile for user ID:', userId);

      const user = await User.findByPk(userId, {
        attributes: ['id', 'nama', 'email', 'phoneNumber', 'address', 'interest']
      });

      if (!user) {
        console.log('User not found for ID:', userId);
        throw Boom.notFound('User not found');
      }

      console.log('Profile retrieved successfully');
      return h.response(user).code(200);
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (request, h) => {
    try {
      const userId = request.auth.credentials.id;
      const { nama, phoneNumber, address, interest } = request.payload;
      
      console.log('Updating profile for user ID:', userId);
      console.log('Update data:', request.payload);

      const user = await User.findByPk(userId);
      if (!user) {
        console.log('User not found for ID:', userId);
        throw Boom.notFound('User not found');
      }

      // Update user data
      await user.update({
        nama: nama || user.nama,
        phoneNumber: phoneNumber || user.phoneNumber,
        address: address || user.address,
        interest: interest || user.interest
      });

      console.log('Profile updated successfully');
      
      // Return updated user data
      return h.response({
        id: user.id,
        nama: user.nama,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        interest: user.interest
      }).code(200);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw Boom.badImplementation('Failed to update profile');
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
