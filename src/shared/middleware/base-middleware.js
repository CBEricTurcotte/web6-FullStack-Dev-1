
require('dotenv').config();
const Express = require('express');
const validator = require('validator');
const app = Express();
app.use(Express.json());

const registerBaseMiddleWare = (app) => {
  app.use(Express.json());
  app.use(logger);
  app.use(myValidator);
};

const logger = (req, res, next) => {
  const message = `API call: ${req.method} on ${req.originalUrl} at ${new Date()}`
  console.log(message);
  next();
};

const myValidator = (req, res, next) => {
  const { email, phone } = req.body;
  const { buildingType } = req.params;
  const { region } = req.query;

  if (email && !validator.isEmail(email)) return res.status(400).send('Invalid Email');
  if (phone && !validator.isMobilePhone(phone)) return res.status(400).send('Invalid Phone Number');
  if (buildingType && !validator.isIn(buildingType, ['residential', 'commercial', 'industrial'])) return res.status(400).send('Wrong Building Type');
  if (region && !validator.isIn(region, ['north', 'east', 'south', 'west'])) return res.status(400).send('Invalid region');

  next();
};

module.exports = { registerBaseMiddleWare, myValidator };

// require('dotenv').config();
// const Express = require('express');
// const validator = require('validator')
// const app = Express();
// app.use(Express.json())
//
// const adminRoutes = [
//   '/email-list',
//   '/region-avg',
//   '/calc-residential'
// ];
//
// const registerBaseMiddleWare = (app) => {
//   app.use(Express.json());
//   app.use(logger);
//   app.use(myValidator);
// };
//
// const logger = (req,res,next) => {
//   const message = `API call: ${req.method} on ${req.originalUrl} at ${new Date()}`
//   console.log(message);
//   next();
// };
//
// const checkAuthToken = (req,res,next) => {
//   const url = req.url.slice(0,req.url.indexOf('?'));
//
//   if(!adminRoutes.includes(url)){
//     next();
//     return;
//   }
//
//   const inputToken = req.headers.token;
//   const savedToken = process.env.TOKEN;
//
//   if(inputToken !== savedToken){
//     res.status(401);
//     res.send('Unauthorized');
//     return;
//   }
//   next();
// };
// const myValidator = (req, res, next) => {
//   const { email, phone } = req.body;
//   const { buildingType } = req.params;
//   const { region } = req.query;
//
//   if (email) {if (!validator.isEmail(email)) return res.status(400).send('Invalid Email');}
//   if (phone) {if (!validator.isMobilePhone(phone)) return res.status(400).send('Invalid Phone Number');}
//   if (buildingType) {if (!validator.isIn(buildingType, ['residential', 'commercial', 'industrial'])) return res.status(400).send('Wrong Building Type');}
//   if (region) {if (!validator.isIn(region.toLowerCase(), ['north', 'east', 'south', 'west'])) {return res.status(400).send('Invalid region');}}
//
//   next();
// }
//
// module.exports = {registerBaseMiddleWare, myValidator};