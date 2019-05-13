const constants = require('./const');
const createError = require('http-errors');
const errorHandler = require('./error');
const logger = constants.logger;
const OK = constants.httpAnswers.OK;

/**
 * Some utilities for the database connection
 *
 */


/**
 * execute a mysql query with parameters and sed the answer
 *
 * @param res the express result to send the json string to
 * @param next the express next function if an error occurs
 * @param query the query to be executed
 * @param parameters the parameters in that query
 * @param allowNull whether to allow null values as parameter or not
 */
const executeQueryAndSendJSON = async (res, next, query, parameters, allowNull = false) => {
    if (!allowNull) {
        for (let i = 0; i < parameters.length; i++) {
            // check if some parameters are null
            if (!parameters[i] && parameters[i] != 0) {
                next(createError(422, "Some parameters are missing! Check the docs."));
                return;
            }
        }
    }

    let result;
    // execute the query
    try {
        result = await executeQuery(query, parameters);
    } catch (MySQLError) {
        errorHandler.handleMySQLError(MySQLError, next);
        return;
    }
    // send json answer
    let answer = {...OK};
    answer.data = result;
    res.json(answer);
};

/**
 * Execute a query and return the result
 * @param query the query to be executed
 * @param parameters the parameters for that query
 */
const executeQuery = async (query, parameters) => {
    const mysql = constants.mysqlConnection;
    if (mysql.state === "disconnected") {
        constants.mysqlConnection = await mysql.connect(constants.mysqlConnectionDetails);
    }
    return await mysql.query(query, parameters);
};

module.exports = {
    executeQueryAndSendJSON,
    executeQuery,
};
