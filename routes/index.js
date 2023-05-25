const router = require('express').Router();
// const { NotFoundError } = require('../errors/NotFoundError');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

/* router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
}); */

module.exports = router;
