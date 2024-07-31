const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.headers.auth;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication error');
    }
    jwt.verify(token, 'thisisasamplesecret', (err) => {
      if (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication error');
      }
      next();
    });
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = {
  socketAuth,
};
