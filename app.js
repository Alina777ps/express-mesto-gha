// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {
  PORT,
} = require('./config');

const {
  createUser,
  login,
} = require('./controllers/users');

const auth = require('./middlewares/auth');

const router = require('./routes/index');

const app = express();

// const PORT = process.env.PORT || 3001;
// const { BD } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('БД подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "public")));

// роуты, не требующие авторизации
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

app.use(router);

app.listen(PORT, () => console.log(`Web app available at http://127.0.0.1:${PORT}`));
