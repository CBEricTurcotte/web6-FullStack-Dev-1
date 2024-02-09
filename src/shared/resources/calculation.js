// IMPORT FROM DATA.JS
import { UNIT_PRICES, INSTALL_PERCENT_FEES } from './data.js';

export const calcResidentialElev = (floors, apts) => Math.ceil(apts / floors / 6) * Math.ceil(floors / 20);
export const calcCommercialElev = (floors, maxOccupancy) => (Math.ceil((maxOccupancy * floors) / 200) * Math.ceil(floors / 10)) + (Math.ceil(floors / 10));
export const calcIndustrialElev = (elevatorsNeeded) => elevatorsNeeded;

export const calcInstallFee = (numElevators, tier) => {
  const UNIT_PRICE = UNIT_PRICES[tier];
  const INSTALL_PERCENT_FEE = INSTALL_PERCENT_FEES[tier];
  return Math.round(numElevators * UNIT_PRICE * ((INSTALL_PERCENT_FEE / 100) + 1));
};