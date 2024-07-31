const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { packageService } = require('../services');

const createPackage = catchAsync(async (req, res) => {
  const packageInfo = await packageService.createPackage(req.body);
  res.status(httpStatus.CREATED).send(packageInfo);
});

const getPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['PID']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await packageService.queryPackages(filter, options);
  res.send(result);
});

const getPackageById = catchAsync(async (req, res) => {
  const packageInfo = await packageService.getPackageById(req.params.packageId);
  if (!packageInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }
  res.send(packageInfo);
});

const updatePackageById = catchAsync(async (req, res) => {
  const packageInfo = await packageService.updatePackageById(req.params.packageId, req.body);
  res.send(packageInfo);
});

const deletePackageById = catchAsync(async (req, res) => {
  await packageService.deletePackageById(req.params.packageId);
  res.status(httpStatus.NO_CONTENT).send();
});

const trackPackageById = catchAsync(async (req, res) => {
  const { packageId } = req.params;
  const packageInfo = await packageService.getPackageById(packageId);

  if (!packageInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }

  res.status(httpStatus.OK).send(packageInfo);
});

const getRealtimeLocation = catchAsync(async (req, res) => {
  const { packageId } = req.params;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*', // Be careful with this in production
  });

  const sendUpdate = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.flush();
  };

  const cleanup = await packageService.subscribeToPackageUpdates(packageId, sendUpdate);

  req.on('close', cleanup);
});

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
  trackPackageById,
  getRealtimeLocation,
};
