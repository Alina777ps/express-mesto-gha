const router = require('express').Router();
const { createUser, getUser, getUserId, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUser);

router.get('/:userId', getUserId);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;