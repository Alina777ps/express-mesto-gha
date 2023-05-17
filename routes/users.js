const router = require('express').Router();
const {
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUser);

router.get('/:userId', getUserId);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
