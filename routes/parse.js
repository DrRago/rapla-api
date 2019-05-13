const iCal = require('node-ical');
const moment = require('moment');
const dbUtil = require('./../util/database');
const createError = require('http-errors');
const constants = require('./../util/const');

const parse_calendar = (async (req, res, next) => {
    let result = [];

    let user = req.params.user;
    let file = req.params.file;

    // create the ical url
    const answer = await dbUtil.executeQuery("SELECT * FROM i_cal WHERE file = ?", [file,]);
    if (answer.length !== 1 && req.params.user === undefined) {
        next(createError(422, "calendar not in database. please pass user (see doc)"));
        return
    } else if (answer.length !== 0) {
        user = answer[0].user;
    }

    iCal.fromURL(`https://rapla.dhbw-karlsruhe.de/rapla?page=ical&user=${user}&file=${file}`, {}, async (err, data) => {
        if (err) {
            if (err.includes("404")) {
                next(createError(404, "Calendar not found"));
                return
            } else {
                next(createError(503, "Internal rapla error"));
                return;
            }
        }
        await dbUtil.executeQuery("INSERT IGNORE INTO i_cal VALUES(?, ?)", [user, file]);
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                const ev = data[k];
                if (data[k].type === 'VEVENT' && data[k].categories.includes("Lehrveranstaltung")) {
                    // parameters of the event to return to user
                    let {start, end, uid, summary, description, location, categories, organizer} = ev;
                    // format the times
                    start = moment(start).format();
                    end = moment(end).format();


                    if (ev.rrule !== undefined) {
                        const rule = ev.rrule;

                        // map the repeat rules to start and end date
                        rule.all().forEach(date => {
                            start = moment(date).format();
                            end = moment(moment(date).format("MM-DD-YYYY") + " " + moment(end).format("HH:mm"), "MM-DD-YYYY HH:mm").format();
                            result = [{
                                start,
                                end,
                                uid,
                                summary,
                                description,
                                location,
                                categories,
                                organizer
                            }, ...result];
                        });
                    } else {
                        result = [{start, end, uid, summary, description, location, categories, organizer}, ...result];
                    }
                }
            }
        }
        result.sort((a, b) => {
            return new Date(a.start) - new Date(b.start);
        });

        let res_object = {...constants.httpAnswers.OK};
        res_object["data"] = result;
        res.json(res_object);
    });
});

module.exports = parse_calendar;
