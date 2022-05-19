const express = require('express');
const router = express.Router();
const { getStatistic, updateStatistic } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/tokenMiddleware');

router.get('/statistic', verifyToken, getStatistic);

router.put('/statistic', verifyToken, updateStatistic);

module.exports = router;