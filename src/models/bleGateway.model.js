const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bleGatewaySchema = new mongoose.Schema(
  {
    imei: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    gatewayMetaInfo: {
      type: Object,
    },

    barcode: {
      type: String,
      validate: {
        validator(value) {
          return value.startsWith('HUTRAC_IMEI_');
        },
        message: (props) => `${props.value} Incorrect Gateway Details !`,
      },
    },
    type: {
      type: String,
      enum: ['Moving', 'Non-Moving'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    location: {
      name: {
        type: String,
      },
      category: {
        type: String,
        enum: ['BDC', 'XDT', 'Custom'],
        required: true,
        validate: {
          validator(value) {
            if (this.type === 'Non-Moving') {
              return value === 'BDC' || value === 'XDT';
            }
            return true;
          },
          message: () => `Location must be 'BDC' or 'XDT' when type is 'Non-Moving'`,
        },
      },
      coordinates: {
        type: [Number],
        validate: {
          validator(value) {
            return value.length === 2 && !Number.isNaN(value[0]) && !Number.isNaN(value[1]);
          },
          message: () => `Coordinates must be a valid array of [longitude, latitude].`,
        },
      },
    },
    sensors: [
      {
        type: Object,
      },
    ],
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

bleGatewaySchema.statics.isIMEITaken = async function (imei) {
  const imeiNumber = await this.findOne({ imei });
  return !!imeiNumber;
};

bleGatewaySchema.statics.isGatewayExists = async function (barcode) {
  const count = await this.countDocuments({ barcode });
  return count > 0;
};

bleGatewaySchema.statics.isGatewayActive = async function (imei) {
  const gateway = await this.findOne({ imei });
  return gateway && gateway.isActive;
};

bleGatewaySchema.plugin(toJSON);
bleGatewaySchema.plugin(paginate);

const BLEGateway = mongoose.model('BLEGateway', bleGatewaySchema);

module.exports = BLEGateway;
