const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'manageAssets',
    'manageSensors',
    'manageGateways',
    'manageLocations',
    'getAssets',
    'getSensors',
    'getGateways',
    'getLocations',
    'getOrders',
    'manageOrders',
    'getVehicles',
    'manageVehicles',
    'getManifests',
    'manageManifests',
  ],
  super_admin: [
    'getUsers',
    'manageUsers',
    'manageAssets',
    'manageSensors',
    'manageGateways',
    'manageLocations',
    'getAssets',
    'getSensors',
    'getGateways',
    'getLocations',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
module.exports = {
  roles,
  roleRights,
};
