const router = require('express').Router();
const {
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUser);

router.get('/:userId', getUserId);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

router.get('/me', getUserInfo);

module.exports = router;
