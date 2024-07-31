const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const packageRoute = require('./package.route');
const bleSensorRoute = require('./bleSensor.route');
const bleGatewayRoute = require('./bleGateway.route');
const onBoardRoute = require('./onBoard.route');
const associationRoute = require('./association.route');
const dashboardRoute = require('./dashboard.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/package',
    route: packageRoute,
  },
  {
    path: '/bleSensor',
    route: bleSensorRoute,
  },
  {
    path: '/bleGateway',
    route: bleGatewayRoute,
  },
  {
    path: '/onboard',
    route: onBoardRoute,
  },
  {
    path: '/association',
    route: associationRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
