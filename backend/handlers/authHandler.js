'use strict';

const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const JWT = require('@hapi/jwt');
const { User } = require('../models');

const authHandler = {    
    register: async (request, h) => {
        try {
            const { nama, email, password, rememberMe } = request.payload;
            console.log('Register attempt for:', email);

            // Periksa apakah pengguna sudah ada
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw Boom.badRequest('Email already registered');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);            // Create user
            const user = await User.create({
                nama,
                email,
                password: hashedPassword
            });

            console.log('User registered successfully:', email);

            // Generate token dengan expiration time
            const expiresIn = request.payload.rememberMe ? '30d' : '1d';
            const token = JWT.token.generate(
                {
                    id: user.id,
                    email: user.email,
                    nama: user.nama,
                    exp: Math.floor(Date.now() / 1000) + (request.payload.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60)
                },
                process.env.JWT_SECRET
            );

            return h.response({
                message: 'Registration successful',
                token
            }).code(201);
        } catch (error) {
            console.error('Register error:', error);
            throw Boom.boomify(error);
        }
    },
    forgotPassword: async (request, h) => {
  const { email } = request.payload;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw Boom.notFound('Email tidak terdaftar');
  }

  const token = JWT.token.generate(
    {
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // expired dalam 1 jam
    },
    process.env.JWT_SECRET
  );

  // Kirim email ke user dengan tautan reset password
  // Misal: `http://localhost:5173/reset-password/${token}`
  console.log(`Link reset: http://localhost:5173/reset-password/${token}`);

  return h.response({ status: 'success', message: 'Link reset password telah dikirim ke email (simulasi)' });
}
,
resetPassword: async (request, h) => {
  try {
    const { token } = request.params;
    const { newPassword } = request.payload;

    // Verifikasi token
    const decoded = JWT.token.decode(token);
    const isValid = JWT.token.verify(decoded, process.env.JWT_SECRET);

    if (!isValid) {
      throw Boom.unauthorized('Token tidak valid atau kadaluwarsa');
    }

    const { email } = decoded.decoded.payload;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Boom.notFound('Pengguna tidak ditemukan');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return h.response({ status: 'success', message: 'Password berhasil diubah' }).code(200);
  } catch (error) {
    console.error('Reset password error:', error);
    return Boom.boomify(error);
  }
}
,
    login: async (request, h) => {
        try {
            const { email, password } = request.payload;
            console.log('Login attempt - Email:', email);

            // Mencari pengguna
            const user = await User.findOne({ where: { email } });
            console.log('Database query result:', user ? 'User found' : 'User not found');

            if (!user) {
                console.log('Login failed: User not found');
                throw Boom.unauthorized('Invalid email or password');
            }

            // Detail log password (hanya dalam pengembangan)
            console.log('Attempting password verification');
            console.log('Input password:', password);
            console.log('Stored hashed password:', user.password);

            // Verifikasi password
            const isValid = await bcrypt.compare(password, user.password);
            console.log('Password verification result:', isValid);

            if (!isValid) {
                console.log('Login failed: Invalid password');
                throw Boom.unauthorized('Invalid email or password');
            }            
            
            // Generate token dengan expiration time berdasarkan rememberMe
            const { rememberMe } = request.payload;
            const token = JWT.token.generate(
                {
                    id: user.id,
                    email: user.email,
                    nama: user.nama,
                    exp: Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60)
                },
                process.env.JWT_SECRET
            );

            console.log('Login successful for user:', user.nama);

            return h.response({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    nama: user.nama,
                    email: user.email
                }
            }).code(200);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
};

module.exports = authHandler;