const httpStatus = require('http-status');
const { Package, BLESensor } = require('../models');
const ApiError = require('../utils/ApiError');

const onBoardPackage = async (packageBody) => {
  let isOnBoarded = false;
  let isAssociated = false;
  let response;
  const barcodeDataString = packageBody.scannedInfo.data;
  const packageDetails = await Package.packageDetails(barcodeDataString);
  if (packageDetails) {
    const { status } = packageDetails;
    if (status === 'On-boarded' || status === 'Disassociated') {
      isOnBoarded = true;
    }
    if (status === 'Associated') {
      isOnBoarded = true;
      isAssociated = true;
    }
  } else {
    const PID = await Package.createPID(barcodeDataString);
    response = await Package.create({
      PID,
      barcode: barcodeDataString,
      createdBy: packageBody.createdBy,
      updatedBy: packageBody.createdBy,
    });
    isOnBoarded = true;
    isAssociated = false;
  }

  return {
    isPackage: true,
    isSensor: false,
    isOnBoarded,
    isAssociated,
    barcode: response ? response.barcode : packageDetails.barcode,
    id: response ? response._id : packageDetails._id,
  };
};

const onBoardSensor = async (sensorBody) => {
  let isOnBoarded = false;
  let isAssociated = false;
  let response;
  const barcodeDataString = sensorBody.scannedInfo.data;
  const sensorDetails = await BLESensor.sensorDetails(barcodeDataString);
  if (sensorDetails) {
    const { status } = sensorDetails;
    // 'On-boarded', 'Associated', 'Disassociated'
    if (status === 'On-boarded' || status === 'Disassociated') {
      isOnBoarded = true;
    }
    if (status === 'Associated') {
      isOnBoarded = true;
      isAssociated = true;
    }
  } else {
    const macAddress = await BLESensor.createMACAddress(barcodeDataString);
    response = await BLESensor.create({
      macAddress,
      barcode: barcodeDataString,
      createdBy: sensorBody.createdBy,
      updatedBy: sensorBody.createdBy,
    });
    isOnBoarded = true;
    isAssociated = false;
  }
  return {
    isPackage: false,
    isSensor: true,
    isOnBoarded,
    isAssociated,
    barcode: response ? response.barcode : sensorDetails.barcode,
    id: response ? response._id : sensorDetails._id,
  };
};

// const onBoardGateway = async (gatewayBody) => {
//   const barcodeDataString = gatewayBody.scannedInfo.data;
//   const gatewayDetails = await Gateway.gatewayDetails(barcodeDataString);

// };

const onBoardEntity = async (entityBody) => {
  const barcodeDataString = entityBody.scannedInfo.data;

  if (!barcodeDataString.startsWith('HUTRAC_')) {
    const packageInfo = await onBoardPackage(entityBody);
    return packageInfo;
  }
  if (barcodeDataString.startsWith('HUTRAC_MA_')) {
    const sensorInfo = await onBoardSensor(entityBody);
    return sensorInfo;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect Scan Found !');
};

module.exports = {
  onBoardEntity,
};
