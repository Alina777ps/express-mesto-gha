const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
// const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { id } = req.user;

  Card.create({ name, link, owner: id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (
        res.status(err.name === 'CastError' || err.name === 'ValidationError')
      ) {
        next(new BadRequestError(
          `Переданы некорректные данные при создании карточки ${err.name}.`,
        ));
      } else {
        next(err);
      }
    });
};
// удаление карточки '/:cardId'
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== id) {
        throw new ForbiddenError('Вы не можете удалить эту карточку.');
      } return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      res.send(deletedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные карточки.',
        ));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(
          'Передан несуществующий _id карточки.',
        ));
      } else {
        next(err);
      }
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ));
      } else if (err.name === 'DocumentNotFoundError') {
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
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else {
        next(err);
      }
    });
};
