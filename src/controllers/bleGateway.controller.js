const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bleGatewayService } = require('../services');

const createBleGateway = catchAsync(async (req, res) => {
  const bleGateway = await bleGatewayService.createBleGateway(req.body);
  res.status(httpStatus.CREATED).send(bleGateway);
});

const getBleGateways = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['imei']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bleGatewayService.queryBleGateways(filter, options);
  res.send(result);
});

const getBleGatewayById = catchAsync(async (req, res) => {
  const bleGateway = await bleGatewayService.getBleGatewayById(req.params.bleGatewayId);
  if (!bleGateway) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ble Gateway not found');
  }
  res.send(bleGateway);
});

const updateBleGatewayById = catchAsync(async (req, res) => {
  const bleGateway = await bleGatewayService.updateBleGatewayById(req.params.bleGatewayId, req.body);
  res.send(bleGateway);
});

const deleteBleGatewayById = catchAsync(async (req, res) => {
  await bleGatewayService.deleteBleGatewayById(req.params.bleGatewayId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBleGateway,
  getBleGateways,
  getBleGatewayById,
  updateBleGatewayById,
  deleteBleGatewayById,
};
