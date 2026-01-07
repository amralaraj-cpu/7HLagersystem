const express = require('express');
const router = express.Router();
const {
    getAllInventory,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
} = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getAllInventory);
router.get('/:id', getInventoryItem);

// Admin only routes
router.post('/', authorize('admin'), createInventoryItem);
router.put('/:id', authorize('admin'), updateInventoryItem);
router.delete('/:id', authorize('admin'), deleteInventoryItem);

module.exports = router;
