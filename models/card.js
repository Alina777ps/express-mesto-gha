const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Введите название'],
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: 30,
    },
    link: {
      type: String,
      required: [true, 'Введите URL'],
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Введите адрес URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
