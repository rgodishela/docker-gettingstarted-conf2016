var faker = require('faker');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// Connecting with Splunk
var SplunkLogger = require("splunk-logging").Logger;
var Logger = new SplunkLogger({
    token: process.env.SPLUNK_TOKEN,
    url: process.env.SPLUNK_URL,
});

Logger.eventFormatter = function (message, severity) {
    return message.line;
}

var index = 0;

function sendNext() {
    var line = faker.fake((++index) + " {{internet.email}} from {{internet.ip}} with {{finance.account}} [{{internet.protocol}}]");
    // console.log("Sending: ", line);
    // Sending data to Splunk
    Logger.send({
        message: {
            line: line
        },
        metadata: {
            source: process.env.SPLUNK_SOURCE,
            sourcetype: process.env.SPLUNK_SOURCETYPE,
            index: process.env.SPLUNK_INDEX
        }
    }, function(err, resp, body) {
        if (err) {
            console.error(err);
        } else if (body.code != 0) {
            console.log("Response:", body);
        }
        setTimeout(sendNext, 100);
    });
}

sendNext();
