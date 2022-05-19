const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const quizzesRoutes = require('./routes/quizzes');
const usersRoutes = require('./routes/users');

const app = express();

const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/users', usersRoutes);

mongoose.connect(config.db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connection to database was successful');
});

mongoose.connection.on('error', (err) => {
  console.log('Connection to database was not successful' + err);
});

app.listen(PORT, () => {
  console.log('Server has been started');
});
