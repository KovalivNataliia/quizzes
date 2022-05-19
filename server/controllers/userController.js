const Statistic = require('../models/statistic');

const getStatistic = async (req, res) => {
  const { _id } = req.decoded;
  try {
    const statistic = await Statistic.getUserStatistic(_id);
    res.status(200).json({ message: 'Success', statistic });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const updateStatistic = async (req, res) => {
  const { _id } = req.decoded;
  const currentStatistic = req.body;
  try {
    let statistic = await Statistic.updateStatisticType(_id, currentStatistic);
    if (!statistic) {
      const newStatisticType = new Statistic({ ...currentStatistic });
      statistic = await Statistic.addNewStatisticType(newStatisticType);
    }
    res.status(200).json({
      message: 'Success',
      statistic
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

module.exports = {
  getStatistic,
  updateStatistic,
};