require('dotenv').config();
const port = process.env.PORT || 3004;
const envName = process.env.ENV_NAME || 'local';

const helloWorld = async (req, res) => {
  res.status(200).send('Hello World!!');
};

const status = async (req, res) => {
  res.status(200).send(`Environment '${envName}' running on port: ${port}`);
};

const error = async (req, res) => {
  res.status(400).send('400 Bad Request - On required request body or parameter');
};

module.exports = { helloWorld, status, error };