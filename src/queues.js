var Q = require('q');

module.exports = {
    Publisher: function(uri, name) {
        var deferred = Q.defer();
        require('amqplib').connect(uri).then(function(conn){        
            conn.createChannel().then(function(ch){
                ch.assertQueue(name);
                console.log("Connected to to queue: " + name);
                var sendFunc = function(data) { 
                    ch.sendToQueue(
                        name, 
                        new Buffer(JSON.stringify(data))
                    );
                }
                deferred.resolve(sendFunc);
            });
        });
        return deferred.promise;        
    },
    Consumer: function(uri, name, ondata, workers) {
        if(!workers) workers =1;
        var deferred = Q.defer();
        require('amqplib').connect(uri).then(function(conn){    
            conn.createChannel().then(function(ch){
                ch.assertQueue(name);
                ch.prefetch(workers);
                ch.consume(name, function(msg) {
                    var data = JSON.parse(msg.content.toString());
                    ondata(data, function() {
                        ch.ack(msg);
                    });
                });
                console.log("Connected to to queue: " + name);
                deferred.resolve(ch);
            }).catch(function (error) {
                console.error(error);
            });
        });
        return deferred.promise;
    }
}