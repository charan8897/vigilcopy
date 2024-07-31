const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { pkg, BLESensor, BLEGateway } = require('../models');
const axios = require('axios');
const config = require('../config/config');
const getDashboardSummary = catchAsync(async (req, res) => {
  try {
    const [
      totalPackages,
      onboardedPackages,
      associatedPackages,
      disassociatedPackages,
      totalSensors,
      associatedSensors,
      onboardedSensors,
      activeSensors,
      totalGateways,
      movingGateways,
      nonMovingGateways,
      bdcGateways,
      xdtGateways,
    ] = await Promise.all([
      pkg.countDocuments(),
      pkg.countDocuments({ status: 'On-boarded' }),
      pkg.countDocuments({ status: 'Associated' }),
      pkg.countDocuments({ status: 'Disassociated' }),
      BLESensor.countDocuments(),
      BLESensor.countDocuments({ status: 'Associated' }),
      BLESensor.countDocuments({ status: 'On-boarded' }),
      BLESensor.countDocuments({ isActive: true }),
      BLEGateway.countDocuments(),
      BLEGateway.countDocuments({ type: 'Moving' }),
      BLEGateway.countDocuments({ type: 'Non-Moving' }),
      BLEGateway.countDocuments({ 'location.category': 'BDC' }),
      BLEGateway.countDocuments({ 'location.category': 'XDT' }),
    ]);

    const associatedPackagesHealth = await pkg.aggregate([
      { $match: { status: 'Associated' } },
      { $group: { _id: '$health', count: { $sum: 1 } } },
    ]);

    const healthData = associatedPackagesHealth.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const dashboardData = {
      total: totalPackages + totalSensors + totalGateways,
      entities: [
        {
          name: 'Packages',
          total: totalPackages,
          hoverMessage: `Total Packages: ${totalPackages}`,
          children: [
            { name: 'On-boarded', value: onboardedPackages },
            {
              name: 'Associated',
              value: associatedPackages,
              hoverMessage: `On-boarded Packages: ${onboardedPackages}`,
              children: [
                {
                  name: 'Health',
                  parameters: {
                    Good: healthData.Good || 0,
                    Critical: healthData.Critical || 0,
                    Warning: healthData.Warning || 0,
                    Offline: healthData.Offline || 0,
                  },
                  hoverMessage: `Health Status - Good: ${healthData.Good || 0}, Critical: ${
                    healthData.Critical || 0
                  }, Warning: ${healthData.Warning || 0}, Offline: ${healthData.Offline || 0}`,
                },
              ],
            },
            {
              name: 'Disassociated',
              value: disassociatedPackages,
              hoverMessage: `Disassociated Packages: ${disassociatedPackages}`,
            },
          ],
        },
        {
          name: 'Sensors',
          total: totalSensors,
          hoverMessage: `Total Sensors: ${totalSensors}`,
          children: [
            {
              name: 'Associated',
              value: associatedSensors,
              hoverMessage: `Associated Sensors: ${associatedSensors}`,
              details: {
                Packages: {
                  name: 'Associated',
                  value: associatedPackages,
                  health: {
                    Good: healthData.Good || 0,
                    Critical: healthData.Critical || 0,
                    Warning: healthData.Warning || 0,
                    Offline: healthData.Offline || 0,
                  },
                  hoverMessage: `Associated Packages: ${associatedPackages}, Health Status - Good: ${
                    healthData.Good || 0
                  }, Critical: ${healthData.Critical || 0}, Warning: ${healthData.Warning || 0}, Offline: ${
                    healthData.Offline || 0
                  }`,
                },
              },
            },
            { name: 'On-boarded', value: onboardedSensors, hoverMessage: `On-boarded Sensors: ${onboardedSensors}` },
            { name: 'Active', value: activeSensors, hoverMessage: `Active Sensors: ${activeSensors}` },
            {
              name: 'Inactive',
              value: totalSensors - activeSensors,
              hoverMessage: `Inactive Sensors: ${totalSensors - activeSensors}`,
            },
          ],
        },
        {
          name: 'Gateways',
          total: totalGateways,
          hoverMessage: `Total Gateways: ${totalGateways}`,
          children: [
            {
              name: 'Moving',
              value: movingGateways,
              hoverMessage: `Moving Gateways: ${movingGateways}`,
              children: [
                {
                  name: 'Custom',
                  value: movingGateways,
                  hoverMessage: `Custom Moving Gateways: ${movingGateways}`,
                },
              ],
            },
            {
              name: 'Non-Moving',
              value: nonMovingGateways,
              hoverMessage: `Non-Moving Gateways: ${nonMovingGateways}`,
              children: [
                {
                  name: 'BDC',
                  value: bdcGateways,
                  hoverMessage: `BDC Gateways: ${bdcGateways}`,
                },
                {
                  name: 'XDT',
                  value: xdtGateways,
                  hoverMessage: `XDT Gateways: ${xdtGateways}`,
                },
              ],
            },
          ],
        },
      ],
    };

    res.status(httpStatus.OK).send(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Failed to fetch dashboard summary',
      error: error.message,
    });
  }
});

const getPackageStats = catchAsync(async (req, res) => {
  const [totalPackages, onboardedPackages, associatedPackages, disassociatedPackages] = await Promise.all([
    pkg.countDocuments(),
    pkg.countDocuments({ status: 'On-boarded' }),
    pkg.countDocuments({ status: 'Associated' }),
    pkg.countDocuments({ status: 'Disassociated' }),
  ]);

  const associatedPackagesHealth = await pkg.aggregate([
    { $match: { status: 'Associated' } },
    { $group: { _id: '$health', count: { $sum: 1 } } },
  ]);

  const healthData = associatedPackagesHealth.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const packageData = {
    name: 'Packages',
    total: totalPackages,
    children: [
      { name: 'On-boarded', value: onboardedPackages },
      {
        name: 'Associated',
        value: associatedPackages,
        children: [
          {
            name: 'Health',
            parameters: {
              Good: healthData.Good || 0,
              Critical: healthData.Critical || 0,
              Warning: healthData.Warning || 0,
              Offline: healthData.Offline || 0,
            },
          },
        ],
      },
      { name: 'Disassociated', value: disassociatedPackages },
    ],
  };

  res.status(httpStatus.OK).send(packageData);
});

const getSensorStats = catchAsync(async (req, res) => {
  const [totalSensors, associatedSensors, onboardedSensors, activeSensors] = await Promise.all([
    BLESensor.countDocuments(),
    BLESensor.countDocuments({ status: 'Associated' }),
    BLESensor.countDocuments({ status: 'On-boarded' }),
    BLESensor.countDocuments({ isActive: true }),
  ]);

  const associatedPackages = await pkg.countDocuments({ status: 'Associated' });
  const associatedPackagesHealth = await pkg.aggregate([
    { $match: { status: 'Associated' } },
    { $group: { _id: '$health', count: { $sum: 1 } } },
  ]);

  const healthData = associatedPackagesHealth.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const sensorData = {
    name: 'Sensors',
    total: totalSensors,
    children: [
      {
        name: 'Associated',
        value: associatedSensors,
        details: {
          Packages: {
            name: 'Associated',
            value: associatedPackages,
            health: {
              Good: healthData.Good || 0,
              Critical: healthData.Critical || 0,
              Warning: healthData.Warning || 0,
              Offline: healthData.Offline || 0,
            },
          },
        },
      },
      { name: 'On-boarded', value: onboardedSensors },
      { name: 'Active', value: activeSensors },
      { name: 'Inactive', value: totalSensors - activeSensors },
    ],
  };

  res.status(httpStatus.OK).send(sensorData);
});

const getGatewayStats = catchAsync(async (req, res) => {
  const [totalGateways, movingGateways, nonMovingGateways, bdcGateways, xdtGateways] = await Promise.all([
    BLEGateway.countDocuments(),
    BLEGateway.countDocuments({ type: 'Moving' }),
    BLEGateway.countDocuments({ type: 'Non-Moving' }),
    BLEGateway.countDocuments({ 'location.category': 'BDC' }),
    BLEGateway.countDocuments({ 'location.category': 'XDT' }),
  ]);

  const gatewayData = {
    name: 'Gateways',
    total: totalGateways,
    children: [
      {
        name: 'Moving',
        value: movingGateways,
        children: [
          {
            name: 'Custom',
            value: movingGateways,
          },
        ],
      },
      {
        name: 'Non-Moving',
        value: nonMovingGateways,
        children: [
          {
            name: 'BDC',
            value: bdcGateways,
          },
          {
            name: 'XDT',
            value: xdtGateways,
          },
        ],
      },
    ],
  };

  res.status(httpStatus.OK).send(gatewayData);
});

const getAssociatedPackagesHealth = catchAsync(async (req, res) => {
  const associatedPackages = await pkg.find({ status: 'Associated' });

  const healthData = await Promise.all(
    associatedPackages.map(async (pkg) => {
      try {
        const response = await axios.get(`${config.baseUrl}/system_health`);
        return {
          packageId: pkg._id,
          packageName: pkg.name,
          health: response.data,
        };
      } catch (error) {
        return {
          packageId: pkg._id,
          packageName: pkg.name,
          health: { error: 'Failed to fetch health data' },
        };
      }
    })
  );

  const healthSummary = healthData.reduce((acc, item) => {
    acc[item.health] = (acc[item.health] || 0) + 1;
    return acc;
  }, {});

  const packageHealthData = {
    name: 'Associated Packages Health',
    total: associatedPackages.length,
    children: [
      {
        name: 'Health',
        parameters: {
          Good: healthSummary.Good || 0,
          Critical: healthSummary.Critical || 0,
          Warning: healthSummary.Warning || 0,
          Offline: healthSummary.Offline || 0,
        },
      },
    ],
    details: healthData,
  };

  res.status(httpStatus.OK).send(packageHealthData);
});

module.exports = {
  getDashboardSummary,
  getPackageStats,
  getSensorStats,
  getGatewayStats,
  getAssociatedPackagesHealth,
};
