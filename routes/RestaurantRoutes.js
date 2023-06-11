const express = require('express');
const router = express.Router();
const { getRestaurant, getRestaurantDetails } = require('../controllers/RestuarantControllers');

router.get('/getRestaurant', getRestaurant);
router.get('/getAll', getRestaurantDetails);

module.exports = router;