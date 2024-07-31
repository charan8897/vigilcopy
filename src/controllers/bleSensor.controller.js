const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bleSensorService } = require('../services');

const createBleSensor = catchAsync(async (req, res) => {
  const bleSensor = await bleSensorService.createBleSensor(req.body);
  res.status(httpStatus.CREATED).send(bleSensor);
});

const getBleSensors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['macAddress']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bleSensorService.queryBleSensors(filter, options);
  res.send(result);
});

const getBleSensorById = catchAsync(async (req, res) => {
  const bleSensor = await bleSensorService.getBleSensorById(req.params.bleSensorId);
  if (!bleSensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ble Sensor not found');
  }
  res.send(bleSensor);
});

const updateBleSensorById = catchAsync(async (req, res) => {
  const bleSensor = await bleSensorService.updateBleSensorById(req.params.bleSensorId, req.body);
  res.send(bleSensor);
});

const deleteBleSensorById = catchAsync(async (req, res) => {
  await bleSensorService.deleteBleSensorById(req.params.bleSensorId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBleSensor,
  getBleSensors,
  getBleSensorById,
  updateBleSensorById,
  deleteBleSensorById,
};
