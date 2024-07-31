const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

mongoose.set('useFindAndModify', false);

const bleSensorSchema = new mongoose.Schema(
  {
    macAddress: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    sensorMetaInfo: {
      type: Object,
    },
    barcode: {
      type: String,
      validate: {
        validator(value) {
          return value.startsWith('HUTRAC_MA_');
        },
        message: (props) => `${props.value} Incorrect Sensor Details !`,
      },
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    status: {
      type: String,
      enum: ['On-boarded', 'Associated', 'Disassociated'],
      default: 'On-boarded',
      required: true,
      validate: {
        validator(value) {
          if (value === 'On-boarded' && this.package) {
            return false;
          }
          if (value === 'Associated' && !this.package) {
            return false;
          }
          if (value === 'Disassociated' && this.package) {
            return false;
          }
          return true;
        },
        message(props) {
          if (props.value === 'On-boarded') {
            return 'On-boarded status should not have a package key.';
          }
          if (props.value === 'Associated') {
            return 'Associated status must have a package key.';
          }
          if (props.value === 'Disassociated') {
            return 'Disassociated status should not have a package key.';
          }
        },
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    gateway: {
      type: Object,
    },
    telemetry: {
      type: Object,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

bleSensorSchema.statics.isMacAddressTaken = async function (macAddress) {
  const macAdd = await this.findOne({ macAddress });
  return !!macAdd;
};

bleSensorSchema.statics.sensorDetails = async function (barcode) {
  const sensorDetails = await this.findOne({ barcode });
  return sensorDetails;
};

bleSensorSchema.statics.createMACAddress = async function (barcode) {
  const trimmedString = barcode.replace('HUTRAC_MA_', '').trim();
  return trimmedString;
};

bleSensorSchema.statics.isSensorExists = async function (barcode) {
  const count = await this.countDocuments({ barcode });
  return count > 0;
};

bleSensorSchema.statics.isSensorOnBoarded = async function (macAddress) {
  const sensor = await this.findOne({ macAddress });
  return sensor && sensor.status === 'On-boarded';
};

bleSensorSchema.statics.isSensorAssociated = async function (macAddress) {
  const sensor = await this.findOne({ macAddress });
  return sensor && sensor.package;
};

bleSensorSchema.statics.isSensorActive = async (barcode) => {
  const sensor = await this.findOne({ barcode });
  // step for checking current time stamp in telemetry
  // ................................................
  return sensor && sensor.isActive;
};

bleSensorSchema.plugin(toJSON);
bleSensorSchema.plugin(paginate);

const BLESensor = mongoose.model('BLESensor', bleSensorSchema);

module.exports = BLESensor;
