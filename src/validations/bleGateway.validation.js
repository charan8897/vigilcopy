const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBleGateway = {
  body: Joi.object()
    .keys({
      imei: Joi.string()
        .pattern(/^\d{15}$/)
        .message('Invalid IMEI format')
        .required(),
      gatewayMetaInfo: Joi.object().optional(),
      barcode: Joi.string()
        .pattern(/^HUTRAC_IMEI_\d{15}$/)
        .required(),
      type: Joi.string().valid('Moving', 'Non-Moving').required(),
      location: Joi.object({
        name: Joi.string().required(),
        category: Joi.string().valid('BDC', 'XDT', 'Custom').required(),
        coordinates: Joi.array().items(Joi.number().required()).length(2).required(),
      }).required(),
      createdBy: Joi.string().custom(objectId).required(),
      updatedBy: Joi.string().custom(objectId).required(),
    })
    .custom((value, helpers) => {
      const { type, location } = value;
      if (type === 'Non-Moving') {
        if (!['BDC', 'XDT'].includes(location.category)) {
          return helpers.message('For Non-Moving type, category must be either BDC or XDT');
        }
      } else if (type === 'Moving') {
        if (location.category !== 'Custom') {
          return helpers.message('For Moving type, category must be Custom');
        }
      }
      if (location.category === 'BDC' || location.category === 'XDT') {
        if (location.coordinates.length !== 2 || location.coordinates.some((v) => Number.isNaN(v))) {
          return helpers.message('Coordinates must be a valid array of [longitude, latitude].');
        }
      } else if (location.category === 'Custom') {
        if (location.coordinates.length !== 2 || location.coordinates[0] !== 0 || location.coordinates[1] !== 0) {
          return helpers.message('Coordinates must be [0, 0] when category is "Custom".');
        }
      }
      return value;
    }),
};

const getBleGateways = {
  query: Joi.object().keys({
    imei: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBleGatewayById = {
  params: Joi.object().keys({
    bleGatewayId: Joi.string().custom(objectId),
  }),
};

const updateBleGatewayById = {
  params: Joi.object().keys({
    bleGatewayId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      gatewayMetaInfo: Joi.object().optional(),
      type: Joi.string().valid('Moving', 'Non-Moving').required(),
      location: Joi.object({
        name: Joi.string().required(),
        category: Joi.string().valid('BDC', 'XDT', 'Custom').required(),
        coordinates: Joi.array().items(Joi.number().required()).length(2).required(),
      }).required(),
      updatedBy: Joi.string().custom(objectId).required(),
    })
    .custom((value, helpers) => {
      const { type, location } = value;

      // Validate category based on type
      if (type === 'Non-Moving') {
        if (!['BDC', 'XDT'].includes(location.category)) {
          return helpers.message('For Non-Moving type, category must be either BDC or XDT');
        }
      } else if (type === 'Moving') {
        if (location.category !== 'Custom') {
          return helpers.message('For Moving type, category must be Custom');
        }
      }

      // Validate coordinates based on category
      if (location.category === 'BDC' || location.category === 'XDT') {
        if (location.coordinates.length !== 2 || location.coordinates.some((v) => Number.isNaN(v))) {
          return helpers.message('Coordinates must be a valid array of [longitude, latitude].');
        }
      } else if (location.category === 'Custom') {
        if (location.coordinates.length !== 2 || location.coordinates[0] !== 0 || location.coordinates[1] !== 0) {
          return helpers.message('Coordinates must be [0, 0] when category is "Custom".');
        }
      }

      return value;
    })
    .min(1),
};

const deleteBleGatewayById = {
  params: Joi.object().keys({
    bleGatewayId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBleGateway,
  getBleGateways,
  getBleGatewayById,
  updateBleGatewayById,
  deleteBleGatewayById,
};
