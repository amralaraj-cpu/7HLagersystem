const express = require('express');
const router = express.Router();
const {
    getAllLocations,
    getLocationByCode,
    getAvailableLocations,
    getWarehouseStats,
    validateLocationCode
} = require('../controllers/locations.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getAllLocations);
router.get('/available', getAvailableLocations);
router.get('/stats', getWarehouseStats);
router.post('/validate', validateLocationCode);
router.get('/:code', getLocationByCode);

module.exports = router;
