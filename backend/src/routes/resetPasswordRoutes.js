const { users } = require('../models');

const resetPasswordHandler = async (request, h) => {
  const { token } = request.params;
  const { newPassword } = request.payload;

  const user = await users.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        [require('sequelize').Op.gt]: Date.now()
      }
    }
  });

  if (!user) {
    return h.response({ message: 'Token tidak valid atau kadaluarsa' }).code(400);
  }

  user.password = newPassword; // ⚠️ Sesuaikan jika pakai hashing
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return h.response({ message: 'Password berhasil diperbarui!' });
};

module.exports = [
  {
    method: 'POST',
    path: '/reset-password/{token}',
    handler: resetPasswordHandler,
    options: {
      auth: false
    }
  }
];
