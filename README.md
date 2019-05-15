# API Documentation

## Routes
### GET /rapla/:file(/:user|/date/:day|/start/:start|/end/:end|/between/:start/:end)?
#### Request parameters
- `file`: the requesting file for rapla (equal to raplas file url-parameter)
- `user`: the rapla username to use to access the file (only needed on first request)
- `day`: specify a day to request, can be a timestamp or on of following: [yesterday, today, tomorrow]
- `start`: minimum date: all events are later than this time
- `end`: maximum date: all events are before this time

#### Response example
##### Code 200 - OK
```json
{
    "code":200,
    "description":"OK",
    "data":[
        {
            "start":"2019-05-06T08:30:00+02:00",
            "end":"2019-05-06T12:45:00+02:00",
            "uid":"a542ca5c-3f85-4301-b117-9c472ac8a93a",
            "summary":"Theoretsiche Informatik II",
            "description":"Theoretsiche Informatik II TINF18B4",
            "location":"F488 INF Hörsaal",
            "categories":["Lehrveranstaltung"],
            "organizer":{
                "params":{"CN":"\"Eisenbiegler, Jörn\""},
                "val":"MAILTO:joern.eisenbiegler@dhbw-karlsruhe.de"
                }
        },...
    ]
}

```

##### Code 404 - Not Found
```json
{
    "code":404,
    "description":"Not Found",
    "details": "Calendar not found"
}

```

##### Code 422 - Unprocessable Entit
```json
{
    "code":422,
    "description":"Unprocessable Entit",
    "details": "calendar not in database. please pass user (see doc)"
}
```

##### Code 503 - Service Unavailable
```json
{
    "code":503,
    "description":"Service Unavailable",
    "details": "Internal rapla error"
}
```

#### Upcomming Features
##### additional request parameters
- `categories`: filter by categories