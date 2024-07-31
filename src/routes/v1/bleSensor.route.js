const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { bleSensorValidation } = require('../../validations');
const { bleSensorController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(bleSensorValidation.createBleSensor), bleSensorController.createBleSensor)
  .get(auth('getUsers'), validate(bleSensorValidation.getBleSensors), bleSensorController.getBleSensors);

router
  .route('/:bleSensorId')
  .get(auth('getUsers'), validate(bleSensorValidation.getBleSensorById), bleSensorController.getBleSensorById)
  .patch(auth('manageUsers'), validate(bleSensorValidation.updateBleSensorById), bleSensorController.updateBleSensorById)
  .delete(auth('manageUsers'), validate(bleSensorValidation.deleteBleSensorById), bleSensorController.deleteBleSensorById);

module.exports = router;
