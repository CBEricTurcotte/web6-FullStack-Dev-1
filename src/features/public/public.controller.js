const Data = require('../../shared/resources/data');
const Calculation = require('../../shared/resources/calculation'); // Import Calculation module
const Contact = require('../../shared/db/mongodb/schemas/contact.Schema'); // Import the Contact model

const contactUs = (req, res) => {
  const { first_name, last_name, email, phone, company_name, project_name, project_desc, department, message } = req.body;

  // Create a new Contact document
  const newContact = new Contact({
    fullname: `${first_name} ${last_name}`,
    email,
    phone,
    company_name,
    project_name,
    project_desc,
    department,
    message
  });

  // Save the new contact to MongoDB
  newContact.save()
    .then(savedContact => {
      console.log('Contact saved:', savedContact);
      const responseMessage = `Message received from ${first_name} ${last_name}: ${message}`;
      console.log(responseMessage);
      res.status(200).send('Contact saved successfully');
    })
    .catch(error => {
      console.error('Error saving contact:', error);
      res.status(500).send('Error saving contact');
    });
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