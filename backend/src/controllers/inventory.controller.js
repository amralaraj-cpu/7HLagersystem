const pool = require('../config/database');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getAllInventory = async (req, res, next) => {
    try {
        const {
            search,
            product_type,
            status,
            season,
            set_id,
            limit = 50,
            offset = 0
        } = req.query;

        let query = 'SELECT * FROM inventory_items WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            query += ` AND (
                product_id ILIKE $${paramCount} OR
                tire_brand ILIKE $${paramCount} OR
                tire_model ILIKE $${paramCount} OR
                tire_dimension ILIKE $${paramCount} OR
                rim_brand ILIKE $${paramCount} OR
                location_code ILIKE $${paramCount}
            )`;
            params.push(`%${search}%`);
        }

        if (product_type) {
            paramCount++;
            query += ` AND product_type = $${paramCount}`;
            params.push(product_type);
        }

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (season) {
            paramCount++;
            query += ` AND tire_season = $${paramCount}`;
            params.push(season);
        }

        if (set_id) {
            paramCount++;
            query += ` AND set_id = $${paramCount}`;
            params.push(set_id);
        }

        query += ' ORDER BY created_at DESC';

        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(parseInt(limit));

        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset));

        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM inventory_items WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private (Admin only)
exports.createInventoryItem = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            product_type,
            location_code,
            tire_brand,
            tire_model,
            tire_dimension,
            tire_season,
            is_studded,
            has_ms_marking,
            manufacturing_year,
            manufacturing_week,
            tread_depth,
            dot_number,
            load_index,
            speed_rating,
            rim_brand,
            rim_diameter,
            rim_width,
            bolt_pattern,
            center_bore,
            rim_offset,
            rim_color,
            tire_condition,
            rim_condition,
            purchase_price,
            selling_price,
            suitable_for,
            notes
        } = req.body;

        // Validate location
        const locationResult = await client.query(
            'SELECT * FROM warehouse_locations WHERE location_code = $1',
            [location_code]
        );

        if (locationResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Invalid location code'
            });
        }

        const location = locationResult.rows[0];

        if (location.is_occupied) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Location is already occupied'
            });
        }

        // Generate product ID
        const productIdResult = await client.query(
            'SELECT COUNT(*) as count FROM inventory_items'
        );
        const count = parseInt(productIdResult.rows[0].count);
        const product_id = `PROD-${String(count + 1).padStart(6, '0')}`;

        // Create inventory item
        const result = await client.query(
            `INSERT INTO inventory_items (
                product_id, product_type, location_code, location_id,
                tire_brand, tire_model, tire_dimension, tire_season,
                is_studded, has_ms_marking, manufacturing_year, manufacturing_week,
                tread_depth, dot_number, load_index, speed_rating,
                rim_brand, rim_diameter, rim_width, bolt_pattern,
                center_bore, rim_offset, rim_color,
                tire_condition, rim_condition,
                purchase_price, selling_price,
                suitable_for, notes, status,
                created_by, updated_by
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
            ) RETURNING *`,
            [
                product_id, product_type, location_code, location.id,
                tire_brand, tire_model, tire_dimension, tire_season,
                is_studded, has_ms_marking, manufacturing_year, manufacturing_week,
                tread_depth, dot_number, load_index, speed_rating,
                rim_brand, rim_diameter, rim_width, bolt_pattern,
                center_bore, rim_offset, rim_color,
                tire_condition, rim_condition,
                purchase_price, selling_price,
                suitable_for, notes, 'available',
                req.user.id, req.user.id
            ]
        );

        // Update location to occupied
        await client.query(
            'UPDATE warehouse_locations SET is_occupied = true, occupied_by_item_id = $1 WHERE id = $2',
            [result.rows[0].id, location.id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin only)
exports.updateInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if item exists
        const checkResult = await pool.query(
            'SELECT * FROM inventory_items WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Build update query dynamically
        const fields = [];
        const values = [];
        let paramCount = 0;

        Object.keys(updates).forEach(key => {
            if (key !== 'id' && key !== 'product_id' && key !== 'created_at') {
                paramCount++;
                fields.push(`${key} = $${paramCount}`);
                values.push(updates[key]);
            }
        });

        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        paramCount++;
        values.push(req.user.id); // updated_by
        fields.push(`updated_by = $${paramCount}`);

        paramCount++;
        values.push(id);

        const query = `
            UPDATE inventory_items
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin only)
exports.deleteInventoryItem = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;

        // Get item
        const itemResult = await client.query(
            'SELECT * FROM inventory_items WHERE id = $1',
            [id]
        );

        if (itemResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        const item = itemResult.rows[0];

        // Free location
        if (item.location_id) {
            await client.query(
                'UPDATE warehouse_locations SET is_occupied = false, occupied_by_item_id = NULL WHERE id = $1',
                [item.location_id]
            );
        }

        // Delete item
        await client.query('DELETE FROM inventory_items WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Inventory item deleted'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};
