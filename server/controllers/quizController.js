const Quiz = require('../models/quiz');

const getDefaultQuizzes = async (req, res) => {
  try {
    const defaultQuizzes = await Quiz.getDefaultQuizzes();
    res.status(200).json({
      message: 'Success',
      quizzes: defaultQuizzes
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const getUserQuizzes = async (req, res) => {
  const user = req.decoded;
  try {
    const userQuizzes = await Quiz.getUserQuizzes(user._id);
    res.status(200).json({
      message: 'Success',
      userQuizzes
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const addQuiz = async (req, res) => {
  const user = req.decoded;
  const quizData = req.body;
  try {
    const newQuiz = new Quiz({
      userId: user._id,
      ...quizData
    });
    const quiz = await Quiz.saveQuiz(newQuiz);
    res.status(200).json({
      message: 'Success',
      quiz
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const getQuiz = async (req, res) => {
  const id = req.params.id;
  try {
    const quiz = await Quiz.getQuizById(id);
    res.status(200).json({
      message: 'Success',
      quiz
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const updateQuiz = async (req, res) => {
  const id = req.params.id;
  try {
    const quiz = await Quiz.getQuizById(id);
    const timesPlayed = quiz.timesPlayed + 1;
    await Quiz.changeQuizTimesPlayed(id, timesPlayed);
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const deleteQuiz = async (req, res) => {
  const id = req.params.id;
  try {
    await Quiz.deleteQuiz(id);
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

module.exports = {
  getDefaultQuizzes,
  getUserQuizzes,
  addQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
};