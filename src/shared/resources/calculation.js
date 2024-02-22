
const data = require('./data');

const calcResidentialElev = (floors, apts) => {
  return Math.ceil(apts / floors / 6) * Math.ceil(floors / 20);
};

const calcCommercialElev = (floors, maxOccupancy) => {
  const elevatorsRequired = Math.ceil((maxOccupancy * floors) / 200) * Math.ceil(floors / 10);
  const freightElevatorsRequired = Math.ceil(floors / 10);
  return freightElevatorsRequired + elevatorsRequired;
};

const calcIndustrialElev = (elevatorsNeeded) => {
  return elevatorsNeeded;
}

const calcInstallFee = (numElevators, tier) => {
  const unitPrice = data.unitPrices[tier];
  const installPercentFees = data.installPercentFees[tier];
  return Math.round(numElevators * unitPrice * ((installPercentFees / 100) + 1));
};

module.exports = { calcResidentialElev, calcCommercialElev, calcIndustrialElev, calcInstallFee };