const asyncWrapper = require('../../shared/util/base-utils');
const Data = require('../../shared/resources/data');
const Calculation = require('../../shared/resources/calculation');
const Contact = require('../../shared/db/mongodb/schemas/contact.Schema');

const contactUs = asyncWrapper(async (req, res) => {
  const data = await Contact.create(req.body);

  const responseMessage = `Message received from ${req.body.fullname}: ${req.body.message}`;
  console.log(responseMessage);

  res.send(data);
});

const calculateQuote = asyncWrapper(async (req, res) => {
  // Define constants
  const buildingType = req.params.buildingType;
  const apts = +req.query.apts;
  const floors = +req.query.floors;
  const maxOccupancy = +req.query.maxOccupancy;
  const elevators = +req.query.elevators;
  const tier = req.query.tier;
  let numElevators, totalCost;

  // Calculate quote based on building type
  if (buildingType === 'residential') {
    numElevators = Calculation.calcResidentialElev(floors, apts);
    totalCost = Calculation.calcInstallFee(numElevators, tier);

  } else if (buildingType === 'commercial') {
    numElevators = Calculation.calcCommercialElev(floors, maxOccupancy);
    totalCost = Calculation.calcInstallFee(numElevators, tier);

  } else if (buildingType === 'industrial') {
    numElevators = Calculation.calcIndustrialElev(elevators);
    totalCost = Calculation.calcInstallFee(numElevators, tier);

  } else {
    return res.status(400).send({ error: 'Invalid or Missing building type' });
  }

  // Format response
  res.status(200).send({
    elevators_required: numElevators,
    cost: Data.formatter.format(totalCost)
  });
});

module.exports = {
  contactUs,
  calculateQuote
};