// BD='mongodb://127.0.0.1:27017/mestodb'

// PORT='3000'

const { PORT = 3000 } = process.env.PORT || 3001;
const { BD = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  BD,
};
