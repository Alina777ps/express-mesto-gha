const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Введите адрес URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Введите email'],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Введите пароль'],
      select: false, // чтобы API не возвращал хеш пароля
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
