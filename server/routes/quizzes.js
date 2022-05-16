const express = require('express');
const router = express.Router();
const {
  getDefaultQuizzes,
  getUserQuizzes,
  addQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');
const { verifyToken } = require('../middlewares/tokenMiddleware');

router.get('/', getDefaultQuizzes);

router.get('/:userId', verifyToken, getUserQuizzes);

router.post('/', verifyToken, addQuiz);

router.get('/:id', verifyToken, getQuiz);

router.patch('/:id', updateQuiz);

router.delete('/:id', verifyToken, deleteQuiz);

module.exports = router;