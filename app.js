// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {
  PORT,
  BD,
} = require('./config');

const router = require('./routes/index');

const app = express();

// const PORT = process.env.PORT || 3001;
// const { BD } = process.env;

mongoose.connect(BD)
  .then(() => {
    console.log('БД подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6454a9d80f882c481aa1cd90',
  };

  next();
});

// app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.listen(PORT, () => console.log(`Web app available at http://127.0.0.1:${PORT}`));
