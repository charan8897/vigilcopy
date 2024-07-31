const mongoose = require('mongoose');
const crypto = require('crypto');
const { toJSON, paginate } = require('./plugins');

const packageSchema = new mongoose.Schema(
  {
    PID: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    packageMetaInfo: {
      type: Object,
    },
    barcode: {
      type: String,
      unique: true,
      validate: {
        validator(value) {
          return !value.startsWith('HUTRAC_');
        },
        message: (props) => `${props.value} Incorrect Asset Details !`,
      },
    },
    sensor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BLESensor',
    },
    gateway: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gateway',
    },
    status: {
      type: String,
      enum: ['On-boarded', 'Associated', 'Disassociated'],
      default: 'On-boarded',
      required: true,
      validate: {
        validator(value) {
          if (value === 'On-boarded' && this.sensor) {
            return false;
          }
          if (value === 'Associated' && !this.sensor) {
            return false;
          }
          if (value === 'Disassociated' && this.sensor) {
            return false;
          }
          return true;
        },
        message(props) {
          if (props.value === 'On-boarded') {
            return 'On-boarded status should not have a sensor key.';
          }
          if (props.value === 'Associated') {
            return 'Associated status must have a sensor key.';
          }
          if (props.value === 'Disassociated') {
            return 'Disassociated status should not have a sensor key.';
          }
        },
      },
    },
    health: {
      type: String,
      enum: ['Good', 'Critical', 'Warning', 'Offline'],
      default: 'Offline',
      required: true,
    },
    telemetry: {
      type: Object,
    },
    thresholds: {
      pitch: {
        min: { type: Number, default: -50 },
        max: { type: Number, default: 50 },
      },
      roll: {
        min: { type: Number, default: -50 },
        max: { type: Number, default: -50 },
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.statics.packageDetails = async function (barcode) {
  const packageDetails = await this.findOne({ barcode });
  return packageDetails;
};

packageSchema.statics.isPackageExists = async function (barcode) {
  const count = await this.countDocuments({ barcode });
  return count > 0;
};

packageSchema.statics.createPID = async function (barcode) {
  const hash = crypto.createHash('sha256').update(barcode).digest('hex');
  const truncatedHash = hash.slice(0, 6);
  return `PID-${truncatedHash}`;
};

packageSchema.statics.isPIDTaken = async function (PID) {
  const packagePIDexists = await this.findOne({ PID });
  return !!packagePIDexists;
};

packageSchema.statics.isPackageOnBoarded = async function (barcode) {
  const packageDocument = await this.findOne({ barcode });
  return packageDocument && packageDocument.status === 'On-boarded';
};

packageSchema.statics.isPackageAssociated = async function (barcode) {
  const packageDocument = await this.findOne({ barcode });
  return packageDocument && packageDocument.sensor && packageDocument.status === 'Associated';
};

packageSchema.statics.isPackageReporting = async function (barcode) {
  const packageDocument = await this.findOne({ barcode });
  return packageDocument.sensor && packageDocument.telemetry && packageDocument.gateway;
};

packageSchema.plugin(toJSON);
packageSchema.plugin(paginate);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
