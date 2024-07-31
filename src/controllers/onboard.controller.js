const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { onBoardService } = require('../services');
const ApiError = require('../utils/ApiError');

const onBoardEntity = catchAsync(async (req, res) => {
  const entity = await onBoardService.onBoardEntity(req.body);
  if (!entity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'BAD REQUEST !!!');
  }
  res.status(httpStatus.OK).send(entity);
});
module.exports = {
  onBoardEntity,
};
