import amqp from 'amqplib/callback_api';
const CONN_URL = 'amqp://fdufyoce:Tc81ENIIT0SjEVxvyhRTCAf2-DnrLhM_@owl.rmq.cloudamqp.com/fdufyoce';


let ch = null;

const publishToQueue = async (data) => {

  amqp.connect(CONN_URL, function (err, conn) {
    // console.log(conn); 

    conn.createChannel(function (err, channel) {
      ch = channel;
      channel.sendToQueue('booktable', new Buffer(data));
    });
  });

}
process.on('exit', (code) => {
   ch.close();
   console.log(`Closing rabbitmq channel`);
});

module.exports = publishToQueue;