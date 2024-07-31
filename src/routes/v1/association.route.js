const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { associationController } = require('../../controllers/index');
const { associationValidation } = require('../../validations/index');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageAssets'),
    validate(associationValidation.associateSensorWithAsset),
    associationController.associateSensorWithAsset
  );

router
  .route('/by-scan')
  .post(
    auth('manageAssets'),
    validate(associationValidation.packageSensorAssociation),
    associationController.packageSensorAssociation
  );

router
  .route('/cancel')
  .patch(validate(associationValidation.packageSensorDisassociation), associationController.packageSensorDisassociation);

router
  .route('/associate-by-barcode')
  .post(auth('manageAssets'), validate(associationValidation.associateByBarcode), associationController.associateByBarcode);

module.exports = router;
