var Botkit = require('./lib/Botkit.js');
var os = require('os');
var getRemoteData=require('./lib/myModules/somma');

var controller = Botkit.consolebot({
    debug: true,
});

//MODIFICA DEL 17/12/2018
/********* modulo botkit middleware dialogflow */

const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    keyFilename: './botkit-test-43930ebfe242.json',  // service account private key file from Google Cloud Console PER QUESTO PC
  });

//******************* */

var bot = controller.spawn();

//funzione di test 

/*function myTest(bot, message, next){
   
    dialogflowMiddleware.receive(bot, message,function()
    {
        console.log('messaggio dal client '+ message.text + " con message type "+ message.type);
        next();
    }); 

} 
controller.middleware.receive.use(myTest); */

/*Receive middleware can be used to do things like preprocess the message content using external natural language processing services like Wit.ai. 
Additional information can be added to the message object for use down the chain.
*/
controller.middleware.receive.use(dialogflowMiddleware.receive);

/* Send middleware can be used to do things like preprocess the message content before it gets sent out to the messaging client.*/

controller.middleware.send.use(dialogflowMiddleware.use);
/*controller.middleware.send.use(function(bot, message, next) {

  // log the outgoing message for debugging purposes
  /*console.log('SENDING ', message.text,'TO USER', message.text);

  next();
  if (message.intent == 'pippo') {
      message.text = 'Hello from DialogFlow!!!';
  }
  console.log('SENDING ', message.text,'TO USER', message.text);
  next();

});*/

//lifecycle convo events
controller.on('conversationStarted', function(bot, convo) {
    console.log('----------------> A conversation started with ', convo.context.user);
  });
  controller.on('conversationEnded', function(bot, convo) {
    console.log('<----------------- A conversation ended with ', convo.context.user + " message " + convo.message);
    
  });
  //'direct_message'  'message_received'
  controller.hears(['Default Welcome Intent'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
    var replyText = message.fulfillment.text;  // message object has new fields added by Dialogflow
    
    bot.reply(message, replyText);
  });
  controller.hears(['test'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
   /*
   var replyText=getRemoteData('http://86.107.98.69:8080/AVA/rest/searchService/search_2?searchText=ciao&user=&pwd=&ava=FarmaInfoBot').then((name) => {
      
      replyText =name;
     */
    var replyText='';
    if (message.entities) {
      console.log('sono nelle entità' + JSON.stringify(message.entities));
     
      
  } else {
    console.log('NON sono nelle entità');
    replyText='casin';
    bot.reply(message, replyText);
  }
    
  //}); 
    
   
  });
//STOP FINE CONVERSAZIONE
  controller.hears(['stopIntent'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
    var replyText = message.fulfillment.text;
    console.log('valore di replyText in stop da DG '+ replyText)
   bot.startConversation(message, function(err, convo) {
    convo.say(replyText);
    
   
 
    convo.stop();
  // convo.next();
    
    })
    
   });
