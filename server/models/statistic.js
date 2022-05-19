const { Schema, model } = require('mongoose');

const statisticSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  quizType: {
    type: String,
    required: true
  },
  quizzesCount: {
    type: Number,
    required: true
  },
  questionsCount: {
    type: Number,
    required: true
  },
  pointsCount: {
    type: Number,
    required: true
  },
  quizTimeCount: {
    type: Number,
    required: true
  }
}, { versionKey: false });

const Statistic = module.exports = model('Statistic', statisticSchema);

module.exports.getUserStatistic = userId => Statistic.find({ userId });

module.exports.updateStatisticType = (userId, statistic) => {
  const filter = { userId, quizType: statistic.quizType }
  return Statistic.findOneAndUpdate(filter, statistic, { returnOriginal: false });
}

module.exports.addNewStatisticType = statistic => statistic.save();