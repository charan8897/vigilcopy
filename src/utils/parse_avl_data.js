// Function to parse AVL ID 11317 data
function parseAvlId11317(data) {
  const sensors = [];
  let offset = 0;

  function readLittleEndian(hex) {
    // Reverse pairs of hex digits and parse as integer
    return parseInt(hex.match(/../g).reverse().join(''), 16);
  }

  offset += 2; // Skip initial 2 bytes

  while (offset < data.length) {
    const sensor = {};

    // Read length of eye sensor data
    const eyeSensorDataLength = parseInt(data.slice(offset, offset + 2), 16) * 2;
    offset += 2;

    // Determine end of sensor data
    const sensorDataEnd = offset + eyeSensorDataLength;

    while (offset < sensorDataEnd) {
      // Read parameter ID
      const parameterId = parseInt(data.slice(offset, offset + 2), 16);
      offset += 2;

      // Read parameter length
      const parameterLength = parseInt(data.slice(offset, offset + 2), 16);
      offset += 2;

      // Read parameter data based on length
      const parameterData = data.slice(offset, offset + parameterLength * 2);
      offset += parameterLength * 2;

      // Process based on parameter ID
      switch (parameterId) {
        case 5: // Device name
          sensor.deviceName = Buffer.from(parameterData, 'hex').toString('ascii').replace(/\0/g, '');
          break;
        case 6: // Temperature
          sensor.temperature = readLittleEndian(parameterData) * 0.01;
          break;
        case 7: // Humidity
          sensor.humidity = parseInt(parameterData, 16);
          break;
        case 8: // Magnet presence
          sensor.magnetPresence = parseInt(parameterData, 16);
          break;
        case 9: // Movement presence
          sensor.movementPresence = parseInt(parameterData, 16);
          break;
        case 10: // Movement count
          sensor.movementCount = readLittleEndian(parameterData);
          break;
        case 11: // Pitch
          sensor.pitch = parseInt(parameterData, 16);
          break;
        case 12: // Angle Roll
          // Handle sign extension using arithmetic operations
          sensor.roll = readLittleEndian(parameterData);
          if (sensor.roll >= 0x8000) {
            sensor.roll = -(0xffff - sensor.roll + 1);
          }
          break;
        case 13: // Low battery indicator
          sensor.lowBatteryIndicator = parseInt(parameterData, 16);
          break;
        case 14: // Battery voltage
          sensor.batteryVoltage = readLittleEndian(parameterData);
          break;
        case 15: // MAC address
          sensor.macAddress = parameterData.match(/../g).join(':');
          break;
        default:
          break;
      }
    }

    sensors.push(sensor);
  }

  return sensors;
}

// Function to parse core message data
function parseCoreMessage(data) {
  const parsedData = {};

  // Mapping of IDs to their descriptions and interpretations
  const idMappings = {
    239: 'Ignition',
    240: 'Movement',
    80: 'Data Mode',
    21: 'GSM Signal',
    200: 'Sleep Mode',
    69: 'GNSS Status',
    181: 'GNSS PDOP',
    182: 'GNSS HDOP',
    66: 'External Voltage',
    24: 'Speed',
    205: 'GSM Cell ID',
    206: 'GSM Area Code',
    67: 'Battery Voltage',
    68: 'Battery Current',
    241: 'Active GSM Operator',
    199: 'Trip Odometer',
    16: 'Total Odometer',
    1: 'Digital Input 1',
    9: 'Analog Input 1',
    179: 'Digital Output 1',
    12: 'Fuel Used GPS',
    13: 'Fuel Rate GPS',
    17: 'Axis X',
    18: 'Axis Y',
    19: 'Axis Z',
    11: 'ICCID1',
    10: 'SD Status',
    2: 'Digital Input 2',
    3: 'Digital Input 3',
    6: 'Analog Input 2',
    180: 'Digital Output 2',
  };

  // Extract data from the core message
  const stateReported = data || {};
  Object.entries(stateReported).forEach(([key, value]) => {
    // Handle ID 11317 with specialized function
    if (key === '11317') {
      parsedData.sensors_telemetry = parseAvlId11317(value);
    } else if (key in idMappings) {
      parsedData[idMappings[key]] = value;
    }
  });

  return parsedData;
}

parseAvlId11317(
  '0120050f544a5958494346585830504c4b38460f063932304f4d450b01330c022d3120050f36564f324a304558483855393838370f065042495a32540b012d0c022d35'
);
module.exports = {
  parseCoreMessage,
  parseAvlId11317,
};
