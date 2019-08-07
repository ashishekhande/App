var amqp = require('amqplib/callback_api');

const CONN_URL = 'amqp://fdufyoce:Tc81ENIIT0SjEVxvyhRTCAf2-DnrLhM_@owl.rmq.cloudamqp.com/fdufyoce';

const Worker = () => {
  amqp.connect(CONN_URL, function (err, conn) {
    console.log('connected');
    conn.createChannel(function (err, ch) {
      if (!ch) { return } 
      console.log('channel created' + ch);
      ch.consume('booktable', function (msg) {
        console.log('.....');
        console.log('msg consumed' + JSON.stringify(msg));
        setTimeout(function () {
          console.log("Message:", msg.content.toString());
        }, 4000);
      }, { noAck: true }
      );
    });
  });
} 

Worker();
