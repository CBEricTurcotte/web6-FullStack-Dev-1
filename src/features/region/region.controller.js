const Region = require('../../shared/db/mongodb/schemas/region.Schema');
const asyncWrapper = require('../../shared/util/base-utils');

const createRegion = asyncWrapper(async (req, res) => {
  const region = await Region.create(req.body);
  res.status(201).json({ msg: 'Region created', data: region });
});

const getRegion = asyncWrapper(async (req, res) => {
  const regionSelected = req.query.region;
  const region = await Region.find({ region: regionSelected.toLowerCase() });
  if (!region.length) {
    return res.status(404).json({ msg: `No region with name ${regionSelected}` });
  }
  res.status(200).json({ region: regionSelected, data: region });
});

const getAllStars = asyncWrapper(async (req, res) => {
  const northRegion = await Region.find({ region: 'north' });
  const southRegion = await Region.find({ region: 'south' });
  const eastRegion = await Region.find({ region: 'east' });
  res.status(200).json({
    region1: 'north',
    topAgent_North: northRegion[0].top_agents[0],
    region2: 'east',
    topAgent_East: eastRegion[0].top_agents[0],
    region3: 'south',
    topAgent_South: southRegion[0].top_agents[0]
  });
});

module.exports = {
  createRegion,
  getRegion,
  getAllStars,
};