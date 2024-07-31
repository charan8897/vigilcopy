const Joi = require('joi');
const { objectId } = require('./custom.validation');

const onBoardEntity = {
  body: Joi.object().keys({
    scannedInfo: Joi.object({
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
    createdBy: Joi.string().custom(objectId).required(),
  }),
};
module.exports = {
  onBoardEntity,
};
