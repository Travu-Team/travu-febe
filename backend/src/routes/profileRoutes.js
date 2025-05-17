'use strict';

const Joi = require('@hapi/joi');
const profileHandler = require('../handlers/profileHandler');

const profileRoutes = [
  {
    method: 'GET',
    path: '/api/user/profile',
    handler: profileHandler.getProfile,
    options: {
      auth: 'jwt',
      description: 'Get user profile',
      tags: ['api', 'profile']
    }
  },
  {
    method: 'PUT',
    path: '/api/user/profile',
    handler: profileHandler.updateProfile,
    options: {
      auth: 'jwt',
      description: 'Update user profile',
      tags: ['api', 'profile'],
      validate: {
        payload: Joi.object({
          nama: Joi.string().optional(),
          phoneNumber: Joi.string().allow('', null).optional(),
          address: Joi.string().allow('', null).optional(),
          interest: Joi.string().allow('', null).optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/user/profile',
    handler: profileHandler.deleteProfile,
    options: {
      auth: 'jwt',
      description: 'Delete user profile',
      tags: ['api', 'profile']
    }
  }
];

module.exports = profileRoutes;
