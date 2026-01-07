const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for dev
    console.error(err);

    // PostgreSQL duplicate key
    if (err.code === '23505') {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        const message = 'Referenced record does not exist';
        error = { message, statusCode: 400 };
    }

    // PostgreSQL invalid input
    if (err.code === '22P02') {
        const message = 'Invalid input value';
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
