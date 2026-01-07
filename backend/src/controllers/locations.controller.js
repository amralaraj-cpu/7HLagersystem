const pool = require('../config/database');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
exports.getAllLocations = async (req, res, next) => {
    try {
        const { type, occupied, aisle, level, search, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM warehouse_locations WHERE 1=1';
        const params = [];
        let paramCount = 0;

        // Filter by type (sales or customer)
        if (type === 'sales') {
            query += ' AND is_customer_storage = false';
        } else if (type === 'customer') {
            query += ' AND is_customer_storage = true';
        }

        // Filter by occupied status
        if (occupied === 'true') {
            query += ' AND is_occupied = true';
        } else if (occupied === 'false') {
            query += ' AND is_occupied = false';
        }

        // Filter by aisle
        if (aisle) {
            paramCount++;
            query += ` AND aisle = $${paramCount}`;
            params.push(aisle.toUpperCase());
        }

        // Filter by level
        if (level) {
            paramCount++;
            query += ` AND level = $${paramCount}`;
            params.push(parseInt(level));
        }

        // Search by location code
        if (search) {
            paramCount++;
            query += ` AND location_code ILIKE $${paramCount}`;
            params.push(`%${search}%`);
        }

        // Add ordering
        query += ' ORDER BY is_customer_storage, aisle, level, unit, position';

        // Add pagination
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(parseInt(limit));

        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset));

        const result = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM warehouse_locations WHERE 1=1';
        const countParams = [];
        let countParamCount = 0;

        if (type === 'sales') {
            countQuery += ' AND is_customer_storage = false';
        } else if (type === 'customer') {
            countQuery += ' AND is_customer_storage = true';
        }

        if (occupied === 'true') {
            countQuery += ' AND is_occupied = true';
        } else if (occupied === 'false') {
            countQuery += ' AND is_occupied = false';
        }

        if (aisle) {
            countParamCount++;
            countQuery += ` AND aisle = $${countParamCount}`;
            countParams.push(aisle.toUpperCase());
        }

        if (level) {
            countParamCount++;
            countQuery += ` AND level = $${countParamCount}`;
            countParams.push(parseInt(level));
        }

        if (search) {
            countParamCount++;
            countQuery += ` AND location_code ILIKE $${countParamCount}`;
            countParams.push(`%${search}%`);
        }

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            total,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get location by code
// @route   GET /api/locations/:code
// @access  Private
exports.getLocationByCode = async (req, res, next) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            'SELECT * FROM warehouse_locations WHERE location_code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        // If occupied, get item details
        let itemDetails = null;
        if (result.rows[0].is_occupied && result.rows[0].occupied_by_item_id) {
            const itemResult = await pool.query(
                'SELECT * FROM inventory_items WHERE id = $1',
                [result.rows[0].occupied_by_item_id]
            );
            if (itemResult.rows.length > 0) {
                itemDetails = itemResult.rows[0];
            }
        }

        res.status(200).json({
            success: true,
            data: {
                location: result.rows[0],
                item: itemDetails
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get available locations
// @route   GET /api/locations/available
// @access  Private
exports.getAvailableLocations = async (req, res, next) => {
    try {
        const { type = 'sales', limit = 100 } = req.query;

        const isCustomerStorage = type === 'customer';

        const result = await pool.query(
            `SELECT * FROM warehouse_locations
             WHERE is_occupied = false AND is_customer_storage = $1
             ORDER BY aisle, level, unit, position
             LIMIT $2`,
            [isCustomerStorage, parseInt(limit)]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get warehouse statistics
// @route   GET /api/locations/stats
// @access  Private
exports.getWarehouseStats = async (req, res, next) => {
    try {
        // Total capacity
        const totalResult = await pool.query(
            'SELECT COUNT(*) as total FROM warehouse_locations'
        );
        const total = parseInt(totalResult.rows[0].total);

        // Sales inventory stats
        const salesResult = await pool.query(
            `SELECT
                COUNT(*) as total_sales_positions,
                SUM(CASE WHEN is_occupied = true THEN 1 ELSE 0 END) as occupied_sales,
                SUM(CASE WHEN is_occupied = false THEN 1 ELSE 0 END) as available_sales
             FROM warehouse_locations
             WHERE is_customer_storage = false`
        );

        // Customer storage stats
        const customerResult = await pool.query(
            `SELECT
                COUNT(*) as total_customer_positions,
                SUM(CASE WHEN is_occupied = true THEN 1 ELSE 0 END) as occupied_customer,
                SUM(CASE WHEN is_occupied = false THEN 1 ELSE 0 END) as available_customer
             FROM warehouse_locations
             WHERE is_customer_storage = true`
        );

        const salesStats = salesResult.rows[0];
        const customerStats = customerResult.rows[0];

        const totalOccupied = parseInt(salesStats.occupied_sales) + parseInt(customerStats.occupied_customer);
        const totalAvailable = parseInt(salesStats.available_sales) + parseInt(customerStats.available_customer);

        res.status(200).json({
            success: true,
            data: {
                total_capacity: total,
                total_occupied: totalOccupied,
                total_available: totalAvailable,
                occupancy_rate: ((totalOccupied / total) * 100).toFixed(2),
                sales_inventory: {
                    total: parseInt(salesStats.total_sales_positions),
                    occupied: parseInt(salesStats.occupied_sales),
                    available: parseInt(salesStats.available_sales),
                    occupancy_rate: ((parseInt(salesStats.occupied_sales) / parseInt(salesStats.total_sales_positions)) * 100).toFixed(2)
                },
                customer_storage: {
                    total: parseInt(customerStats.total_customer_positions),
                    occupied: parseInt(customerStats.occupied_customer),
                    available: parseInt(customerStats.available_customer),
                    occupancy_rate: ((parseInt(customerStats.occupied_customer) / parseInt(customerStats.total_customer_positions)) * 100).toFixed(2)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Validate location code format
// @route   POST /api/locations/validate
// @access  Private
exports.validateLocationCode = async (req, res, next) => {
    try {
        const { locationCode } = req.body;

        if (!locationCode) {
            return res.status(400).json({
                success: false,
                message: 'Location code is required'
            });
        }

        // Validate format
        const salesPattern = /^[A-Z]-(0[1-9]|10)-(0[1-9]|10)-[1-7]$/;
        const customerPattern = /^C-[A-Z]-(0[1-9]|10)-(0[1-9]|10)-[1-7]$/;

        const isSalesFormat = salesPattern.test(locationCode);
        const isCustomerFormat = customerPattern.test(locationCode);

        if (!isSalesFormat && !isCustomerFormat) {
            return res.status(400).json({
                success: false,
                message: 'Invalid location code format',
                valid: false
            });
        }

        // Check if exists
        const result = await pool.query(
            'SELECT * FROM warehouse_locations WHERE location_code = $1',
            [locationCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Location does not exist',
                valid: false
            });
        }

        const location = result.rows[0];

        res.status(200).json({
            success: true,
            valid: true,
            data: {
                location_code: locationCode,
                type: location.is_customer_storage ? 'customer' : 'sales',
                is_occupied: location.is_occupied,
                exists: true
            }
        });
    } catch (error) {
        next(error);
    }
};
