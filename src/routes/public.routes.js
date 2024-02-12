const PublicController = require('../features/public/public.controller');
const BaseMiddleware = require('../shared/middleware/base-middleware');

const registerPublicRoutes = (app) => {
  app.post('/contact',BaseMiddleware.myValidator, PublicController.contactUs);
  app.get('/calc', PublicController.calculateResidentialQuote);
};

module.exports = { registerPublicRoutes, };