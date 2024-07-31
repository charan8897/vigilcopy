const Joi = require('joi');

const getDashboardSummary = {
  query: Joi.object().keys({
    // Add any query parameters if needed
  }),
};

const getPackageStats = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

const getSensorStats = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

const getGatewayStats = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

const getAssociatedPackagesHealth = {
  query: Joi.object().keys({
    // Add any specific query parameters for health data if needed
  }),
};

module.exports = {
  getDashboardSummary,
  getPackageStats,
  getSensorStats,
  getGatewayStats,
  getAssociatedPackagesHealth,
};
