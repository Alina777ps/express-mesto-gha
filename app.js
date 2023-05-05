const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes/index');
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6454a9d80f882c481aa1cd90'
  };

  next();
});

//app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.listen(PORT, () => console.log(`PORT ${PORT}`));