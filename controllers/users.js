const User = require('../models/user');
const { BAD_REQUEST_ERROR, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../errors/errors');

module.exports.getUser = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка по умолчанию ${err.name} c текстом ${err.message} и стектрейс ${err.stack}` }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({message: 'Некорректные данные при поиске пользователя по _id'});
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка по умолчанию ${err.name} c текстом ${err.message} и стектрейс ${err.stack}` });
    });};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка по умолчанию ${err.name} c текстом ${err.message} и стектрейс ${err.stack}` });
    });
};

//PATCH /users/me — обновляет профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail()
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка по умолчанию ${err.name} c текстом ${err.message} и стектрейс ${err.stack}` });
    });
};

//PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }
  )
    .orFail()
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара. ' });
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка по умолчанию ${err.name} c текстом ${err.message} и стектрейс ${err.stack}` });
    });
};

