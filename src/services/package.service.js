const httpStatus = require('http-status');
const { Package } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a packageInfo
 * @param {Object}packageBody
 * @returns {Promise<Package>}
 */
const createPackage = async (packageBody) => {
  if (await Package.isPIDTaken(packageBody.PID)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'PID Already Taken !');
  }
  if (await Package.isPackageExists(packageBody.barcode)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Package Exists !');
  }
  return Package.create(packageBody);
};

/**
 * Query forpackages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPackages = async (filter, options) => {
  const packages = await Package.paginate(filter, options);
  return packages;
};

/**
 * Get packageInfo by id
 * @param {ObjectId} id
 * @returns {Promise<Package>}
 */
const getPackageById = async (id) => {
  return Package.findById(id);
};

/**
 * Update packageInfo by id
 * @param {ObjectId}packageId
 * @param {Object} updateBody
 * @returns {Promise<Package>}
 */
const updatePackageById = async (packageId, updateBody) => {
  const packageInfo = await getPackageById(packageId);
  if (!packageInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }

  Object.assign(packageInfo, updateBody);
  await packageInfo.save();
  return packageInfo;
};

/**
 * Delete packageInfo by id
 * @param {ObjectId}packageId
 * @returns {Promise<Package>}
 */
const deletePackageById = async (packageId) => {
  const packageInfo = await getPackageById(packageId);
  if (!packageInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }
  await packageInfo.remove();
  return packageInfo;
};

const subscribeToPackageUpdates = async (packageId, sendUpdate) => {
  const packageInfo = await Package.findById(packageId);
  if (!packageInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }

  const updateInterval = setInterval(async () => {
    const updatedPackage = await Package.findById(packageId);
    if (updatedPackage) {
      sendUpdate({
        packageInfo: updatedPackage,
        time: new Date().toISOString(),
      });
    }
  }, 5000);

  // Send initial update
  sendUpdate({
    packageInfo,
    time: new Date().toISOString(),
  });

  // Return a cleanup function
  return () => clearInterval(updateInterval);
};

module.exports = {
  createPackage,
  queryPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
  subscribeToPackageUpdates,
};
