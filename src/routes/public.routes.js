
const PublicController = require('../features/public/public.controller');
const {myValidator} = require('../shared/middleware/base-middleware');

const registerPublicRoutes = (app) => {
  app.post('/contact', myValidator, PublicController.contactUs);

  app.get('/calc/:buildingType', myValidator, PublicController.calculateQuote);
}

module.exports = {
  registerPublicRoutes
};