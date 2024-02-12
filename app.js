require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3004;

const MongoManager = require('./src/shared/db/mongodb/mongo-manager');
const MiddleWare = require('./src/shared/middleware/base-middleware');
const HealthRoutes = require('./src/routes/health.routes');
const AdminRoutes = require('./src/routes/admin.routes');
const PublicRoutes = require('./src/routes/public.routes');
const AgentRoutes = require('./src/routes/agent.routes');
const regionRouter = require('./src/routes/region.routes');

// Enable CORS for all requests
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('./src/public'));

// Parse JSON bodies
app.use(express.json());

// Register middleware
MiddleWare.registerBaseMiddleWare(app);

// Register routes
HealthRoutes.registerHealthRoutes(app);
AdminRoutes.registerAdminRoutes(app);
PublicRoutes.registerPublicRoutes(app);
AgentRoutes.registerAgentRoutes(app);
regionRouter.registerRegionRoutes(app);

// Handle preflight requests for the '/contact' endpoint
app.options('/contact', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

// Open MongoDB connection
MongoManager.openMongoConnection();

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
