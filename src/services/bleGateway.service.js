const httpStatus = require('http-status');
const { BLEGateway } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a bleGateway
 * @param {Object} bleGatewayBody
 * @returns {Promise<BleGateway>}
 */

// BleGateway bleGateway
const createBleGateway = async (bleGatewayBody) => {
  if (await BLEGateway.isIMEITaken(bleGatewayBody.imei)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'IMEI Already taken !');
  }

  if (await BLEGateway.isGatewayExists(bleGatewayBody.barcode)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate barcode !');
  }
  return BLEGateway.create(bleGatewayBody);
};

/**
 * Query for BleGateway
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBleGateways = async (filter, options) => {
  const bleGateway = await BLEGateway.paginate(filter, options);
  return bleGateway;
};

/**
 * Get bleGateway by id
 * @param {ObjectId} id
 * @returns {Promise<BLEGateway>}
 */
const getBleGatewayById = async (id) => {
  return BLEGateway.findById(id);
};

/**
 * Update bleGateway by id
 * @param {ObjectId} bleGatewayId
 * @param {Object} updateBody
 * @returns {Promise<Package>}
 */
const updateBleGatewayById = async (bleGatewayId, updateBody) => {
  const bleGateway = await getBleGatewayById(bleGatewayId);
  if (!bleGateway) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ble Gateway not found');
  }

  Object.assign(bleGateway, updateBody);
  await bleGateway.save();
  return bleGateway;
};

/**
 * Delete bleGateway by id
 * @param {ObjectId} bleGatewayId
 * @returns {Promise<BleGateway>}
 */
const deleteBleGatewayById = async (bleGatewayId) => {
  const bleGateway = await getBleGatewayById(bleGatewayId);
  if (!bleGateway) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ble Gateway not found');
  }
  await bleGateway.remove();
  return bleGateway;
};

module.exports = {
  createBleGateway,
  queryBleGateways,
  getBleGatewayById,
  updateBleGatewayById,
  deleteBleGatewayById,
};
