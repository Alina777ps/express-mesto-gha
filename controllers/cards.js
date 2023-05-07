const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({
        message: `Произошла ошибка ${err.name} c текстом ${err.message} и стектрейс ${err.stack}`,
      })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(req.body);
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
      console.log(card);
    })
    .catch((err) => {
      if (
        res.status(err.name === 'CastError' || err.name === 'ValidationError')
      ) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: `Произошла ошибка ${err.name} c текстом ${err.message} и стектрейс ${err.stack}`,
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        res.send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные карточки.' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: `Произошла ошибка ${err.name} c текстом ${err.message} и стектрейс ${err.stack}`,
      });
    });
};

//PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail()
    .then((card) => {
      if (!card) {
        res.send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: `Произошла ошибка ${err.name} c текстом ${err.message} и стектрейс ${err.stack}`,
      });
    });
};

//DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (res.status(err.name === 'CastError')) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: `Произошла ошибка ${err.name} c текстом ${err.message} и стектрейс ${err.stack}`,
      });
    });
};
