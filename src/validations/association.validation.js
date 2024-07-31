const Joi = require('joi');
const { objectId } = require('./custom.validation');

const packageSensorAssociation = {
  body: Joi.object().keys({
    packageScannedInfo: Joi.object({
      type: Joi.string().valid('barcode', 'qr_code').required(),
      data: Joi.string().max(100).required(),
      format: Joi.string().optional(),
      timestamp: Joi.date().optional(),
      position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        width: Joi.number().required(),
        height: Joi.number().required(),
      }).optional(),
      frame: Joi.string().base64().optional(),
    }).required(),
    sensorScannedInfo: Joi.object({
      type: Joi.string().valid('qr_code').required(),
      data: Joi.string().max(100).required(),
      format: Joi.string().optional(),
      timestamp: Joi.date().optional(),
      position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        width: Joi.number().required(),
        height: Joi.number().required(),
      }).optional(),
      frame: Joi.string().base64().optional(),
    }).required(),
    createdBy: Joi.string().custom(objectId).required(),
  }),
};

const packageSensorDisassociation = {
  body: Joi.object().keys({
    entityId: Joi.string().custom(objectId).required(),
    updatedBy: Joi.string().custom(objectId).required(),
  }),
};
const associateSensorWithAsset = {
  body: Joi.object().keys({
    assetId: Joi.string().required().custom(objectId),
    sensorId: Joi.string().required().custom(objectId),
    createdBy: Joi.string().required().custom(objectId),
  }),
};

const associateByBarcode = {
  body: Joi.object().keys({
    assetBarcode: Joi.string().required(),
    sensorBarcode: Joi.string().required(),
    createdBy: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  associateSensorWithAsset,
  associateByBarcode,
  packageSensorAssociation,
  packageSensorDisassociation,
};
