const httpStatus = require('http-status');
const { BLESensor } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a bleSensor
 * @param {Object} bleSensorBody
 * @returns {Promise<BleSensor>}
 */
const createBleSensor = async (bleSensorBody) => {
  if (await BLESensor.isMacAddressTaken(bleSensorBody.macAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mac Address Already Exists !');
  }
  if (await BLESensor.isSensorExists(bleSensorBody.barcode)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Barcode Already Exists !');
  }
  return BLESensor.create(bleSensorBody);
};

/**
 * Query for BleSensor
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBleSensors = async (filter, options) => {
  const bleSensor = await BLESensor.paginate(filter, options);
  return bleSensor;
};

/**
 * Get bleSensor by id
 * @param {ObjectId} id
 * @returns {Promise<BLESensor>}
 */
const getBleSensorById = async (id) => {
  return BLESensor.findById(id);
};

/**
 * Update bleSensor by id
 * @param {ObjectId} bleSensorId
 * @param {Object} updateBody
 * @returns {Promise<Package>}
 */
const updateBleSensorById = async (bleSensorId, updateBody) => {
  const bleSensor = await BLESensor.findByIdAndUpdate(bleSensorId, updateBody, { new: true });
  if (!bleSensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ble Sensor not found');
  }
  return bleSensor;
};

/**
 * Delete bleSensor by id
 * @param {ObjectId} bleSensorId
 * @returns {Promise<BleSensor>}
 */
const deleteBleSensorById = async (bleSensorId) => {
  const bleSensor = await getBleSensorById(bleSensorId);
  if (!bleSensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ble Sensor not found');
  }
  await bleSensor.remove();
  return bleSensor;
};

module.exports = {
  createBleSensor,
  queryBleSensors,
  getBleSensorById,
  updateBleSensorById,
  deleteBleSensorById,
};
