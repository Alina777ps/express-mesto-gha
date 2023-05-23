const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
// const ConflictError = require('../errors/ConflictError');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (
        res.status(err.name === 'CastError' || err.name === 'ValidationError')
      ) {
        next(new BadRequestError(
          'Переданы некорректные данные при создании карточки.',
        ));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
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
        next(new BadRequestError(
          'Переданы некорректные данные карточки.',
        ));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else {
        return next(err);
      }
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
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
        next(new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else {
        next(err);
      }
    });
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      const newError = new Error();
      newError.name = 'DocumentNotFoundError';
      throw newError;
    })
    .then((card) => {
      if (!card) {
        res.send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else {
        next(err);
      }
    });
};
