const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { dashboardValidation } = require('../../validations');
const { dashboardController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth('getUsers'), validate(dashboardValidation.getDashboardStats), dashboardController.getDashboardSummary);

router
  .route('/package')
  .get(auth('getUsers'), validate(dashboardValidation.getDashboardStats), dashboardController.getPackageStats);

router
  .route('/sensor')
  .get(auth('getUsers'), validate(dashboardValidation.getDashboardStats), dashboardController.getSensorStats);

router
  .route('/gateway')
  .get(auth('getUsers'), validate(dashboardValidation.getDashboardStats), dashboardController.getGatewayStats);

router
  .route('/package/health')
  .get(auth('getUsers'), validate(dashboardValidation.getDashboardStats), dashboardController.getAssociatedPackagesHealth);

module.exports = router;
