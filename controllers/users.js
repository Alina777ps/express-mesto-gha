const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { getJwtToken } = require('../utils/jwt');

const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

const SALT_ROUNDS = 10;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res
      .status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Некорректные данные при поиске пользователя по _id',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
    });
};

// регистрация
module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then(() => res.send({ message: 'Пользователь успешно создан.' }))
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({
            message: 'Такой пользователь уже существует.',
          });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля.',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара. ',
          });
      }
      if (err.name === 'CastError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(BAD_REQUEST_ERROR).send({ message: 'Email или пароль не могут быть пустыми' });

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
          const token = getJwtToken(user._id);
          console.log(user._id);
          return res.send({ token });
        });
    })
    .catch(next);
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Некорректные данные при поиске пользователя по _id',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
    });
};
