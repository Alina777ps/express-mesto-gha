const router = require('express').Router();
const { NOT_FOUND } = require('../errors/errors');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена.' });
});

module.exports = router;
