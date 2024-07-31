const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Asset, Sensor, Package, BLESensor } = require('../models/index');
const { onBoardEntity } = require('./onboard.service');

const packageSensorAssociation = async (associationBody) => {
  const { packageScannedInfo, sensorScannedInfo, createdBy } = associationBody;
  if (!packageScannedInfo.data || !sensorScannedInfo.data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Empty Scanned Data !');
  }
  const packageEntityInfo = await onBoardEntity({
    scannedInfo: packageScannedInfo,
    createdBy: associationBody.createdBy,
  });
  const sensorEntityInfo = await onBoardEntity({
    scannedInfo: sensorScannedInfo,
    createdBy: associationBody.createdBy,
  });
  if (packageEntityInfo.isPackage && sensorEntityInfo.isSensor) {
    if (!packageEntityInfo.isAssociated && !sensorEntityInfo.isAssociated) {
      await Package.findByIdAndUpdate(packageEntityInfo.id, {
        sensor: sensorEntityInfo.id,
        status: 'Associated',
        updatedBy: createdBy,
      });
      await BLESensor.findByIdAndUpdate(sensorEntityInfo.id, {
        package: packageEntityInfo.id,
        status: 'Associated',
        updatedBy: createdBy,
      });
      return { message: 'Association done!' };
    }
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${packageEntityInfo.isAssociated ? 'Package Already Associated' : 'Package Not Associated'} and ${
        sensorEntityInfo.isAssociated ? 'Sensor Already Associated' : 'Sensor Not Associated'
      }`
    );
  } else if (
    (!packageEntityInfo.isPackage && sensorEntityInfo.isSensor) ||
    (packageEntityInfo.isPackage && !sensorEntityInfo.isSensor)
  ) {
    return {
      message: 'Similar Entities Association not Allowed !',
    };
  } else if (!packageEntityInfo.isPackage && !sensorEntityInfo.isSensor) {
    const temp = sensorEntityInfo;
    const swapSensorEntityInfo = packageEntityInfo;
    const swapPackageEntityInfo = temp;
    if (!swapPackageEntityInfo.isAssociated && !swapSensorEntityInfo.isAssociated) {
      await Package.findByIdAndUpdate(swapPackageEntityInfo.id, {
        sensor: swapSensorEntityInfo.id,
        status: 'Associated',
        updatedBy: createdBy,
      });
      await BLESensor.findByIdAndUpdate(swapSensorEntityInfo.id, {
        package: swapPackageEntityInfo.id,
        status: 'Associated',
        updatedBy: createdBy,
      });
      return { message: 'Association done! from here !' };
    }
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${swapPackageEntityInfo.isAssociated ? 'Package Already Associated' : 'Package Not Associated'} and ${
        swapSensorEntityInfo.isAssociated ? 'Sensor Already Associated' : 'Sensor Not Associated'
      }`
    );
  }
};

const packageSensorDisassociation = async (disassociationBody) => {
  const { entityId, updatedBy } = disassociationBody;
  const packageInfo = await Package.findById({ _id: entityId });
  const sensorInfo = await BLESensor.findById({ _id: entityId });
  if (!packageInfo && !sensorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Entity not found !');
  }
  if (packageInfo && sensorInfo) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Logical Inconsistency Found');
  }
  if (packageInfo && !sensorInfo) {
    if (packageInfo.status === 'On-boarded' && packageInfo.sensor) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Entity Association Issue');
    }
    await BLESensor.findByIdAndUpdate(packageInfo.sensor, {
      $unset: { package: '' },
      $set: { status: 'Disassociated', updatedBy },
    });
    const newPackageInfo = await Package.findOneAndUpdate(
      entityId,
      {
        $unset: { sensor: '' },
        $set: { status: 'Disassociated', updatedBy },
      },
      {
        new: true,
      }
    );
    return newPackageInfo;
  }
  if (!packageInfo && sensorInfo) {
    if (sensorInfo.status === 'On-boarded' && sensorInfo.package) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sensor is not Associated ');
    }
    await Package.findByIdAndUpdate(sensorInfo.package, {
      $unset: { sensor: '' },
      $set: { status: 'Disassociated', updatedBy },
    });

    const newSensorInfo = await BLESensor.findByIdAndUpdate(
      entityId,
      {
        $unset: { package: '' },
        $set: { status: 'Disassociated', updatedBy },
      },
      {
        new: true,
      }
    );
    return newSensorInfo;
  }
};

const associateSensorWithAsset = async (associationDetails) => {
  const { assetId, sensorId, createdBy } = associationDetails;

  // Find the asset by ID
  const assetDetails = await Asset.findById(assetId);
  if (!assetDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }

  // Find the sensor by ID
  const sensorDetails = await Sensor.findById(sensorId);
  if (!sensorDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sensor not found');
  }

  // Assign the sensor to the asset
  assetDetails.sensor = sensorId;
  await assetDetails.save();

  // Update the sensor's assigned_asset_id and createdBy fields
  sensorDetails.assigned_asset_id = assetId;
  sensorDetails.createdBy = createdBy;
  await sensorDetails.save();

  return {
    asset: assetDetails,
    sensor: sensorDetails,
  };
};

const associateByBarcode = async (associationDetails) => {
  const { assetBarcode, sensorBarcode, createdBy } = associationDetails;

  const assetDetails = await Asset.findOne({ barcode: assetBarcode });
  if (!assetDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }

  const sensorDetails = await Sensor.findOne({ barcode: sensorBarcode });
  if (!sensorDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sensor not found');
  }

  assetDetails.sensor = sensorDetails._id;
  await assetDetails.save();

  sensorDetails.assigned_asset_id = assetDetails._id;
  sensorDetails.createdBy = createdBy;
  await sensorDetails.save();

  return {
    asset: assetDetails,
    sensor: sensorDetails,
  };
};

module.exports = {
  associateSensorWithAsset,
  associateByBarcode,
  packageSensorAssociation,
  packageSensorDisassociation,
};
