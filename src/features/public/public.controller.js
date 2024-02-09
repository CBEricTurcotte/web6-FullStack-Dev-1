const Data = require('../../shared/resources/data');
const Calculation = require('../../shared/resources/calculation'); // Import Calculation module

const contactUs = (req, res) => {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const message = req.body.message;

  const responseMessage = `Message received from ${firstName} ${lastName}`;

  console.log(responseMessage);
  res.send(responseMessage);
};

const calculateResidentialQuote = (req, res) => {
  const buildingType = req.params.buildingType;
  const apts = +req.query.apts;
  const floors = +req.query.floors;
  const maxOccupancy = +req.query.maxOccupancy;
  const elevators = +req.query.elevators;
  const tier = req.query.tier;

  // Check if required parameters are provided
  if (!buildingType || !apts || !floors || !tier) {
    return res.status(400).send({ error: 'Missing required parameters' });
  }

  let numElevators, totalCost;

  if (buildingType.toLowerCase() === 'residential') {
    numElevators = Calculation.calcResidentialElev(floors, apts);
    totalCost = Calculation.calcInstallFee(numElevators, tier);
  } else if (buildingType.toLowerCase() === 'commercial') {
    numElevators = Calculation.calcCommercialElev(floors, maxOccupancy);
    totalCost = Calculation.calcInstallFee(numElevators, tier);
  } else if (buildingType.toLowerCase() === 'industrial') {
    numElevators = Calculation.calcIndustrialElev(elevators);
    totalCost = Calculation.calcInstallFee(numElevators, tier);
  } else {
    return res.status(400).send({ error: 'Invalid building type' });
  }

  res.status(200).send({
    elevators_required: numElevators,
    cost: Data.formatter.format(totalCost)
  });
};

module.exports = { contactUs, calculateResidentialQuote };