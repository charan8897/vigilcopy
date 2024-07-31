const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { associationService } = require('../services');

const packageSensorAssociation = catchAsync(async (req, res) => {
  const associationMessage = await associationService.packageSensorAssociation(req.body);
  res.status(httpStatus.OK).send(associationMessage);
});

const packageSensorDisassociation = catchAsync(async (req, res) => {
  const disassociation = await associationService.packageSensorDisassociation(req.body);
  res.status(httpStatus.OK).send(disassociation);
});

const associateSensorWithAsset = catchAsync(async (req, res) => {
  const associateResponse = await associationService.associateSensorWithAsset(req.body);
  res.status(httpStatus.CREATED).send(associateResponse);
});

const associateByBarcode = catchAsync(async (req, res) => {
  const associateResponse = await associationService.associateByBarcode(req.body);
  res.status(httpStatus.CREATED).send(associateResponse);
});

module.exports = {
  associateSensorWithAsset,
  associateByBarcode,
  packageSensorAssociation,
  packageSensorDisassociation,
};
