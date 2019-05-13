/**
 * some constants for the general functionality
 */

const mysqlConnectionDetails = {
    host: 'mysql.drrago.de',
    user: 'rapla',
    password: 'fspEhnPbN3MKNw0n',
    database: 'rapla'
};

let mysqlConnection = false;
let logger = false;
const httpAnswers = {
    OK: {code: 200, description: "OK"},
    NOCONTENT: {code: 204, description: "No Content"},
    BADREQUEST: {code: 400, description: "Bad Request"},
    UNAUTH: {code: 401, description: "Unauthorized"},
    FORBIDDEN: {code: 403, description: "Forbidden"},
    NOTFOUND: {code: 404, description: "Not Found"},
    GONE: {code: 410, description: "Gone"},
    UNPROCESSABLEENTITY: {code: 422, description: "Unprocessable Entity"},
    INTERNAL: {code: 500, description: "Internal Server Error"},
    SERVICEUNAVAILABLE: {code: 503, description: "Service Unavailable"}
};


module.exports = {
    mysqlConnectionDetails,
    mysqlConnection,
    logger,
    httpAnswers,
};
