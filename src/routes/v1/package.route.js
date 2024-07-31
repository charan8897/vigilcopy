const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { packageValidation } = require('../../validations');
const { packageController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(packageValidation.createPackage), packageController.createPackage)
  .get(auth('getUsers'), validate(packageValidation.getPackages), packageController.getPackages);

router
  .route('/:packageId')
  .get(auth('getUsers'), validate(packageValidation.getPackageById), packageController.getPackageById)
  .patch(auth('manageUsers'), validate(packageValidation.updatePackageById), packageController.updatePackageById)
  .delete(auth('manageUsers'), validate(packageValidation.deletePackageById), packageController.deletePackageById);

router
  .route('/track/:packageId')
  .get(auth('manageUsers'), validate(packageValidation.getPackageById), packageController.trackPackageById);

router
  .route('/location/:packageId')
  .get(auth('manageUsers'), validate(packageValidation.getPackageById), packageController.getRealtimeLocation);

module.exports = router;
