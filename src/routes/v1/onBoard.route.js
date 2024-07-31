const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { onBoardValidation } = require('../../validations');
const { onBoardController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth('manageUsers'), validate(onBoardValidation.onBoardEntity), onBoardController.onBoardEntity);
module.exports = router;
