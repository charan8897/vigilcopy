const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPackage = {
  body: Joi.object().keys({
    PID: Joi.string()
      .pattern(/^PID-\d+$/)
      .required(),
    barcode: Joi.string().required(),
    packageMetaInfo: Joi.object().optional(),
    sensor: Joi.string().custom(objectId).optional(),
    gateway: Joi.string().custom(objectId).optional(),
    threshold: Joi.object({
      pitch: Joi.object({
        min: Joi.number().default(-50),
        max: Joi.number().default(50),
      }).required(),
      roll: Joi.object({
        min: Joi.number().default(-50),
        max: Joi.number().default(-50),
      }).required(),
    }).optional(),
    createdBy: Joi.string().custom(objectId).required(),
    updatedBy: Joi.string().custom(objectId).required(),
  }),
};

const getPackages = {
  query: Joi.object().keys({
    PID: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPackageById = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

const updatePackageById = {
  params: Joi.object().keys({
    packageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      PID: Joi.string()
        .pattern(/^PID-\d+$/)
        .optional(),
      packageMetaInfo: Joi.object().optional(),
      threshold: Joi.object({
        pitch: Joi.object({
          min: Joi.number().default(-50),
          max: Joi.number().default(50),
        }).required(),
        roll: Joi.object({
          min: Joi.number().default(-50),
          max: Joi.number().default(-50),
        }).required(),
      }).optional(),
      updatedBy: Joi.string().custom(objectId).required(),
    })
    .min(1),
};

const deletePackageById = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
};
