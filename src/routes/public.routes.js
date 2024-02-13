const PublicController = require('../features/public/public.controller');
const BaseMiddleware = require('../shared/middleware/base-middleware');

const validateBuildingType = (req, res, next) => {
  const validBuildingTypes = ['residential', 'commercial', 'industrial'];
  const buildingType = req.params.buildingType;

  // Check if buildingType is provided and is a non-empty string
  if (!buildingType || typeof buildingType !== 'string') {
    return res.status(400).json({ error: 'Invalid building type' });
  }

  // Convert to lowercase for case-insensitive comparison
  const lowerCaseBuildingType = buildingType.toLowerCase();

  // Check if buildingType is valid
  if (!validBuildingTypes.includes(lowerCaseBuildingType)) {
    return res.status(400).json({ error: 'Invalid building type' });
  }

  // If buildingType is valid, proceed to the next middleware/controller
  next();
};

const registerPublicRoutes = (app) => {
  app.post('/contact', BaseMiddleware.myValidator, PublicController.contactUs);
  app.get('/calc/:buildingType', validateBuildingType, BaseMiddleware.myValidator, PublicController.calculateQuote);
};

module.exports = { registerPublicRoutes };