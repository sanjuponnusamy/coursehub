
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
  res.send('Online Course Management API is running!');
});

mongoose.connect('mongodb://127.0.0.1:27017/onlineCourseDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err.message));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
