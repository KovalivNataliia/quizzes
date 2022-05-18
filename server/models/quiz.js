const { Schema, model } = require('mongoose');

const quizSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  correct_answer: {
    type: String,
    required: true
  },
  incorrect_answers: [{
    type: String,
    required: true
  }]
});

const quizDataSchema = new Schema({
  userId: {
    type: String
  },
  quizName: {
    type: String,
    required: true
  },
  pointsPerQuestion: {
    type: Number,
    required: true
  },
  timesPlayed: {
    type: Number,
    default: 0
  },
  createdByUser: {
    type: Boolean,
    default: true
  },
  quiz: [quizSchema]
}, { versionKey: false });

const Quiz = module.exports = model('Quiz', quizDataSchema);

module.exports.getQuizById = id => Quiz.findById(id);

module.exports.saveQuiz = quiz => quiz.save();

module.exports.deleteQuiz = id => Quiz.findByIdAndRemove(id);

module.exports.changeQuizTimesPlayed = (_id, timesPlayed) => {
  return Quiz.findByIdAndUpdate({ _id }, { timesPlayed });
};

module.exports.getUserQuizzes = userId => Quiz.find({ userId });

module.exports.getDefaultQuizzes = () => Quiz.find({ createdByUser: false });
