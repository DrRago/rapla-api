const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const log = require('simple-node-logger').createSimpleLogger('log.log');
const mysql = require('async-mysql');
const path = require('path');
const constants = require('./util/const');

log.setLevel('info');
constants.logger = log;

const createMySQLConnection = async () => {
    constants.mysqlConnection = await mysql.connect(constants.mysqlConnectionDetails);
};

const dbUtils = require('./util/database');

// the routing files
const parser = require('./routes/parse');

let {user, host, database} = constants.mysqlConnectionDetails;
createMySQLConnection().then(log.info(`connected to mysql at ${user}@${host}/${database}`)).catch(reason => log.fatal(reason));

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// add custom routes
app.use('/rapla/:file/start/:start', parser);
app.use('/rapla/:file/end/:end', parser);
app.use('/rapla/:file/between/:start/:end', parser);
app.use('/rapla/:file/date/:day', parser);
app.use('/rapla/:file/:user?', parser);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // log detailed error
    // no detailed information needed
    const noLogging = [400, 401, 403, 404, 422];
    if (noLogging.includes(err.status)) {
        log.error(`${err.status} - ${err.message}`);
    } else {
        // log status separately
        log.error(err.status);
        log.error(err);
    }

    // return json error
    let errorMessage = {};
    for (const response in constants.httpAnswers) {
        if (constants.httpAnswers[response].code === err.status) {
            errorMessage = {...constants.httpAnswers[response]};
        }
    }

    // if no handler exists for this error, throw an internal error, eventhough it is probably not internal
    if (errorMessage.code === undefined) {
        errorMessage = {...constants.httpAnswers.INTERNAL};
    }
    errorMessage.details = err.message;
    res.status(errorMessage.code).json(errorMessage);
});

module.exports = app;
