// BD='mongodb://127.0.0.1:27017/mestodb'

// PORT='3000'

const { PORT = 3000 } = process.env;

const JWT_SECRET = '5d6dfc0e440cf1ec72d5ad48c3d4f32bc044a459ec2785959b49b60f94a29422';

module.exports = {
  PORT,
  JWT_SECRET,
};
