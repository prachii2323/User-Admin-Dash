const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://prachii0223:T06BE3dx92UIsFth@cluster0.5ny1ww4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  username: String,
  password: String,
  userType: { type: String, enum: ['admin', 'user'], default: 'user' },
  loginTime: String,
  logoutTime: String,
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  const { name, phone, email, username, password } = req.body;
  let userType = 'user';
  if (email.endsWith('@numetry.com')) {
    userType = 'admin';
  }
  const loginTime = new Date().toLocaleString();
  const user = new User({ name, phone, email, username, password, userType, loginTime });
  await user.save();
  res.send({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    if (user.userType === 'admin') {
      res.send({ message: 'Welcome to the admin dashboard' });
    } else {
      res.send({ message: 'Welcome to the user dashboard' });
    }
  } else {
    res.send({ message: 'Invalid email or password' });
  }
});

app.post('/logout', async (req, res) => {
  const { email } = req.body;
  const logoutTime = new Date().toLocaleString();
  await User.findOneAndUpdate({ email }, { logoutTime });
  res.send({ message: 'User logged out successfully' });
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
