const createError = require('http-errors');

/**
 * Custom handler for mysql errors
 *
 * @param err the mysql error
 * @param next express next function to create the error
 */
const handleMySQLError = (err, next) => {
    // catch user errors
    // BAD_NULL appears when e.g. the sensor type wasn't sent correctly
    // DUP_ENTRY appears when a table key (sensorID) already exists
    if (err.code === "ER_BAD_NULL_ERROR" || err.code === "ER_DUP_ENTRY") {
        // send error to be handled by express
        next(createError(400, err.message));
        return;
    } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
        next(createError(422, "Some parameters that reference to other tables don't exist (like username or bookingID)"));
        return;
    } else if (err.code === "ER_PARSE_ERROR") {
        next(createError(500, err.message));
        return;
    } else if (err.code === "ER_ROW_IS_REFERENCED_2") {
        next(createError(422, "This value is still used. Check Possible dependencies."));
        return;
    }
    // send error to be handled by express
    next(createError(err));
}

module.exports = {
    handleMySQLError
}
