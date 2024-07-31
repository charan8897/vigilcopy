const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { bleGatewayValidation } = require('../../validations');
const { bleGatewayController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(bleGatewayValidation.createBleGateway), bleGatewayController.createBleGateway)
  .get(auth('getUsers'), validate(bleGatewayValidation.getBleGateways), bleGatewayController.getBleGateways);

router
  .route('/:bleGatewayId')
  .get(auth('getUsers'), validate(bleGatewayValidation.getBleGatewayById), bleGatewayController.getBleGatewayById)
  .patch(auth('manageUsers'), validate(bleGatewayValidation.updateBleGatewayById), bleGatewayController.updateBleGatewayById)
  .delete(
    auth('manageUsers'),
    validate(bleGatewayValidation.deleteBleGatewayById),
    bleGatewayController.deleteBleGatewayById
  );

module.exports = router;
