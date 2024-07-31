const Joi = require('joi');
const { objectId } = require('./custom.validation');

const macAddressPattern = /^([0-9A-Fa-f]{2}:){4}[0-9A-Fa-f]{2}$/;
const barcodePattern = /^HUTRAC_MA_([0-9A-Fa-f]{2}:){4}[0-9A-Fa-f]{2}$/;

const createBleSensor = {
  body: Joi.object().keys({
    macAddress: Joi.string().pattern(macAddressPattern).message('Invalid MAC address format').required(),
    sensorMetaInfo: Joi.object().optional(),
    barcode: Joi.string().pattern(barcodePattern).message('Invalid barcode sensor format').required(),
    package: Joi.string().custom(objectId).optional(),
    createdBy: Joi.string().custom(objectId).required(),
    updatedBy: Joi.string().custom(objectId).required(),
  }),
};

const getBleSensors = {
  query: Joi.object().keys({
    macAddress: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBleSensorById = {
  params: Joi.object().keys({
    bleSensorId: Joi.string().custom(objectId),
  }),
};

const updateBleSensorById = {
  params: Joi.object().keys({
    bleSensorId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      sensorMetaInfo: Joi.object().optional(),
      updatedBy: Joi.string().custom(objectId).required(),
    })
    .min(1),
};

const deleteBleSensorById = {
  params: Joi.object().keys({
    bleSensorId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBleSensor,
  getBleSensors,
  getBleSensorById,
  updateBleSensorById,
  deleteBleSensorById,
};
