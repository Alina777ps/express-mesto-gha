const router = require('express').Router();
const { createUser, getUser, getUserId, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUser);

router.get('/:userId', getUserId);

router.post('/', createUser);

router.post('/me', updateUser);

router.post('/me/avatar', updateAvatar);

module.exports = router;