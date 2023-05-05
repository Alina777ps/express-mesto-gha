const router = require('express').Router();
const { getCard, createCard, deleteCard } = require('../controllers/cards');

router.get('/', getCard);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

module.exports = router;