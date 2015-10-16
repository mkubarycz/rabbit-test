// Exercise a queue >>

var Q = require('q');
var queues = require('./queues.js');
var assert = require("assert");

var settings = {
    QueueUri: process.env.QUEUE_URI || 'amqp://guest:guest@dockerhost:5672',
    QueueName: process.env.QUEUE_NAME || 'test',
    workers: parseInt(process.env.WORKERS) || 1
};

var Echo = function(data) {
  var deferred = Q.defer();
  console.log(data);
  deferred.resolve();
  return deferred.promise;
};

console.log("Lets do this shizzy...");

queues.Publisher(settings.QueueUri, settings.QueueName).then(function(Send) {
    console.log("Connected as publisher.  Sending data every 100ms.  Kill the process to stop me.")
    setInterval(function() {
      Send({
        Date: new Date()
      });
    }, 100);
}).catch(function(err) {
  console.error(err);
});

queues.Consumer(settings.QueueUri, settings.QueueName, function(data, ack) {
    console.log(data);
    ack();
}, settings.workers).catch(function(err) {
  console.error(err);
});


