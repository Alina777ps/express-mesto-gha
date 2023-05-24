const bcrypt = require('bcryptjs');
const { getJwtToken } = require('../utils/jwt');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const SALT_ROUNDS = 10;

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Некорректные данные при поиске пользователя по _id',
        ));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(
          'Пользователь по указанному id не найден.',
        ));
      } else {
        next(err);
      }
    });
};

// регистрация
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      const { id } = user;

      return res.status(201).send({
        name,
        about,
        avatar,
        email,
        id,
        message: 'Пользователь успешно создан',
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует.'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        ));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { id } = req.user;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        ));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.user;
  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователь с указанным _id не найден.');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные при обновлении аватара.',
        ));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(
          'Пользователь с указанным _id не найден.',
        ));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError('Email или пароль не могут быть пустыми');

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неправильные почта или пароль');
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) throw new UnauthorizedError('Неправильные почта или пароль');
        const token = getJwtToken(user.id);
        return res.send({ token });
      });
    })
    .catch(next);
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getUserInfo = (req, res, next) => {
  const { id } = req.user;
  User.findById(id)
    .orFail()
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError('Пользователь с данным _id не найден.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Некорректные данные при поиске пользователя по _id',
        ));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(
          'Пользователь по указанному _id не найден.',
        ));
      } else {
        next(err);
      }
    });
};
