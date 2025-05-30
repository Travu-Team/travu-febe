'use strict';

const Joi = require('@hapi/joi');
const authHandler = require('../handlers/authHandler');
const { User } = require('../models');

const authRoutes = [
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: authHandler.register,
        options: {
            auth: false,            validate: {
                payload: Joi.object({
                    nama: Joi.string().required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required(),
                    rememberMe: Joi.boolean().default(false)
                })
            }
        }
    },
    {
    method: 'POST',
    path: '/api/auth/forgot-password',
    handler: authHandler.forgotPassword,
    options: {
        auth: false,
        validate: {
            payload: Joi.object({
                email: Joi.string().email().required()
            })
        }
    }
},
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: authHandler.login,
        options: {
            auth: false,            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                    rememberMe: Joi.boolean().default(false)
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/users/check',
        handler: async (request, h) => {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email']
            });
            return h.response(users);
        },
        options: {
            auth: false
        }
    }
];

module.exports = authRoutes;
