var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var crypto = require('crypto');

var db = new sqlite3.Database('logs.db', (err) => {
    if (err) {
        console.error(err);
    }
    console.log('Connected to Database.');
});


var updateLog = function (topic, message) {
    var time = moment().format('yyyy-MM-D') + " " + moment().format("HH:mm:ss");
    var sql = ` INSERT INTO devicelogs (device_id, field, message, time)
                VALUES ('${topic.split('/')[0]}', '${topic.split('/')[1]}', ${message}, '${time}')`
    db.get(sql, [], (err, row) => {
        if (err) {
            console.log(err);
        }
    });

    var sql = ` UPDATE devices 
                SET last_updated='${time}'
                WHERE device_id='${topic.split('/')[0]}'`
    db.get(sql, [], (err, row) => {
        if (err) {
            console.log(err);
        }
    });
}

var register = (req, res) => {
    var sql = ` SELECT 1 
                FROM users 
                WHERE email = '${req.body.email}' OR ( invite_key = '${req.body.invite_key}' AND email IS NOT NULL )`
    db.all(sql, [], (err, rows) => {
        if (err) {
            // return back an error response
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else if(rows.length>=1) {
            // return message saying that user exists.
            console.log(rows);
            console.log("created 2");
            return res.status(409).json({ message: 'Either the email you have entered is already in use, or this invite key has already been used.' });
        }
        else {
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512',salt)
                                            .update(req.body.password)
                                            .digest("base64");
            password = salt + '$' + hash;

            var sql = ` UPDATE users 
                        set fullname='${req.body.fullname}', email='${req.body.email}', password='${password}'
                        WHERE invite_key = '${req.body.invite_key}'`
            db.all(sql, [], (err, rows) => {
                if (err) {
                    // return back an error response
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
                }
                else {
                    // return message saying that user exists.
                    console.log("created");
                    return res.status(201).json({ message: 'Created User' });
                }
            });
        }
    });
}

var login = (req, res) => {
    var sql = ` SELECT password
                FROM users
                WHERE email='${req.body.email}'`
    db.get(sql, [], (err, row) => {
        console.log(row);
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else if (row==null) {
            return res.status(409).json({ message: 'Record not found.' });
        }
        else {
            let salt = row.password.split('$')[0]
            let hash = crypto.createHmac('sha512',salt)
                                            .update(req.body.password)
                                            .digest("base64");
            console.log(hash);
            console.log(row.password.split("$")[1]);
            if(hash==row.password.split('$')[1]) {
                return res.status(200).json({ message: 'Correct Password' });
                
            }
            else {
                return res.status(401).json({ message: 'Wrong Password' });
            }
        }
    });
}

var getUsers = (req, res) => {
    var sql = ` SELECT fullname, email 
                FROM users`
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).json({'users': rows});
        }
    });
}

var generateInviteKey = function(req, res) {
    var invite_key = crypto.randomBytes(20).toString('hex');
    var sql = ` INSERT INTO users (invite_key)
                VALUES ('${invite_key}')`
    db.get(sql, [], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else {
            return res.status(201).json({'invite_key': invite_key});
        }
    });
}

var createDevice = (req, res) => {
    // generate a sensor id AKA a topic to subscribe to.
    var device_id = crypto.randomBytes(16).toString('hex');

    var sql = ` INSERT INTO devices (device_id, name, zone, description)
                VALUES ('${device_id}', '${req.body.name}', '${req.body.zone}', '${req.body.description}')`
    db.get(sql, [], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
    });
    
    req.body.fields.forEach(field => {
        var sql = ` INSERT INTO fields (device_id, field)
                    VALUES ('${device_id}', '${field}')`
        db.get(sql, [], (err, row) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Internal server error. Please try again later.' });
            }
        });
    });

    res.status(201).json({"device_id": device_id});    
}

var getTopics = function () {
    var sql = ` SELECT * FROM TABLE fields`
    db.all(sql, [], (err, rows) => {
        return rows;
    });
}

var getDevices = (req, res) => {
    var sql = ` SELECT * FROM devices`
    db.all(sql, [], (err, rows) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else {
            return res.status(200).json({ devices: rows });
        }
    });
}

var getDeviceOverviews = (req, res) => {
    var sql = ` SELECT * FROM devices
                WHERE device_id='${req.params.device_id}'`
    db.get(sql, [], (err, row) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else {
            return res.status(200).json( row );
        }
    });
}

var getLogs = (req, res) => {
    var sql = ` SELECT devicelogs.device_id, devicelogs.field, devicelogs.message, devicelogs.time, devices.zone, devices.name
                FROM devicelogs, devices
                WHERE devicelogs.device_id LIKE '${req.body.device_id}' AND devices.device_id LIKE '${req.body.device_id}'
                ORDER BY time ASC
                LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
    db.all(sql, [], (err, rows) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else {
            return res.status(200).json( rows )
        }
    }); 
}

var countLogs = (req, res) => {
    var sql = ` SELECT COUNT(*)
                FROM devicelogs
                WHERE device_id LIKE '${req.body.device_id}'`
    db.get(sql, [], (err, row) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else {
            return res.status(200).json( {count: row["COUNT(*)"]} )
        }
    }); 
}

var getSettings = (req, res) => {
    var sql = ` SELECT devices.device_id, name, zone, description, group_concat(field, ',') as fields  
                FROM devices, fields
                WHERE devices.device_id = '${req.params.device_id}' AND fields.device_id = '${req.params.device_id}'
                GROUP BY devices.device_id`
    db.get(sql, [], (err, row) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
        else {
            try {
                row.fields = row.fields.split(',');
            }
            catch (err) {

            }
            console.log("rows: "+ row);
            return res.status(200).json(row)
        }
    })
}

var deleteDevice = (req, res) => {
    var sql = ` DELETE FROM devices WHERE device_id = '${req.params.device_id}'`
    db.get(sql, [], (err, row) => {
        
    });
    sql = ` DELETE FROM fields WHERE device_id = '${req.params.device_id}'`
    db.get(sql, [], (err, row) => {

    });
    return res.status(204).send("success");
}

var setSettings = (req, res) => {
    var sql = ` UPDATE devices
                SET name = '${req.body.name}', zone = '${req.body.zone}', description = '${req.body.description}'
                WHERE device_id = '${req.params.device_id}'`
    db.get(sql, [], (err, row) => {
        if (err)
            res.status(409).send("bad");
    });
    var sql = ` DELETE FROM fields WHERE device_id = '${req.params.device_id}'`
    db.get(sql, [], (err, row) => {
        if (err)
            res.status(409).send("bad");
    });
    
    req.body.fields.forEach(field => {
        var sql = ` INSERT INTO fields (device_id, field)
                    VALUES ('${req.params.device_id}', '${field}')`
        db.get(sql, [], (err, row) => {
            if (err)
                res.status(409).send("bad");
        });
    });

    res.status(201).send("updated successfully");
}

module.exports = { register, login, getUsers, generateInviteKey, createDevice, getTopics, updateLog, getDeviceOverviews, getLogs, getDevices, getSettings, setSettings, deleteDevice, countLogs };