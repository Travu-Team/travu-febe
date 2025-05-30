const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');
const { users } = require('../models');

const forgotPasswordHandler = async (request, h) => {
  const { email } = request.payload;

  const user = await users.findOne({ where: { email } });
  if (!user) {
    return h.response({ message: 'Email tidak ditemukan' }).code(404);
  }

  const resetToken = uuidv4();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 jam dari sekarang
  await user.save();

  const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
  const emailText = `
Hai ${user.username},

Kami menerima permintaan reset password untuk akun Travu Anda.
Silakan klik link berikut untuk mengatur ulang password Anda:

${resetLink}

Jika Anda tidak merasa meminta ini, abaikan email ini.

Salam,
Travu Support
  `;

  await sendEmail(user.email, 'Reset Password - Travu', emailText);
  return h.response({ message: 'Link reset dikirim ke email Anda!' });
};

module.exports = [
  {
    method: 'POST',
    path: '/forgot-password',
    handler: forgotPasswordHandler,
    options: {
      auth: false
    }
  }
];