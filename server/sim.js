// send a test message every 5 seconds
var simulate = function(client) {
    var msgLoop = setInterval( function() {
        var topic = 'd011a24776d83d27e24f5f2008f994e6/temperature';
        var message = '76.9';
        client.publish(topic, message);
    },5000);
}

module.exports = { simulate };

