var Botkit = require('./lib/Botkit.js');
var os = require('os');
var getRemoteData=require('./lib/myModules/somma');

var controller = Botkit.consolebot({
    debug: true,
});

//MODIFICA DEL 17/12/2018
/********* modulo botkit middleware dialogflow */

const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    keyFilename: './botkit-test-7ea2ab19c3d7.json',  // service account private key file from Google Cloud Console
  });

//******************* */

var bot = controller.spawn();
controller.middleware.receive.use(dialogflowMiddleware.receive);

controller.middleware.send.use(dialogflowMiddleware.use);
controller.middleware.send.use(function(bot, message, next) {

  // log the outgoing message for debugging purposes
  /*console.log('SENDING ', message.text,'TO USER', message.text);

  next();*/
  if (message.intent == 'hey') {
      message.text = 'Hello from DialogFlow!!!';
  }
  console.log('SENDING ', message.text,'TO USER', message.text);
  next();

});
//lifecycle convo events
controller.on('conversationStarted', function(bot, convo) {
    console.log('----------------> A conversation started with ', convo.context.user);
  });
  controller.on('conversationEnded', function(bot, convo) {
    console.log('<----------------- A conversation ended with ', convo.context.user);
  });
  controller.hears(['Default Welcome Intent'], 'direct_message', dialogflowMiddleware.hears, function(bot, message) {
    var replyText = message.fulfillment.text;  // message object has new fields added by Dialogflow
    bot.reply(message, replyText);
  });

  

