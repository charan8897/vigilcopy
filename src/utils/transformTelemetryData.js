function transformTelemetryData(telemetryDoc) {
  const transformedData = [];

  // Extract necessary fields from telemetry document
  const { imei, serverTimestamp, deviceTimestamp, telemetryData } = telemetryDoc;

  const { parsedGatewayData, latlng } = telemetryData;

  // Process each sensor data entry in sensors_data array
  if (parsedGatewayData && parsedGatewayData.sensorsData) {
    parsedGatewayData.sensorsData.forEach((sensor) => {
      const transformedSensor = {
        imei,
        deviceTimestamp,
        serverTimestamp,
        name: sensor.deviceName,
        macAddress: sensor.macAddress || '',
        temperature: sensor.temperature,
        humidity: sensor.humidity,
        roll: sensor.roll,
        pitch: sensor.pitch,
        otherGatewayData: {
          Digital_Input_1: parsedGatewayData['Digital Input 1'] || 0,
          Trip_Odometer: parsedGatewayData['Trip Odometer'] || 0,
          Ignition: parsedGatewayData.Ignition || 0,
          Movement: parsedGatewayData.Movement || 0,
          latlng: latlng || [0, 0],
        },
      };

      transformedData.push(transformedSensor);
    });
  }

  return transformedData;
}

module.exports = {
  transformTelemetryData,
};
