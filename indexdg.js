var Botkit = require('./lib/Botkit.js');
var os = require('os');
var getRemoteData=require('./lib/myModules/somma');
var ctrlEsseTre=require('./Classi/clsControllerS3.js');
var studente=require('./Classi/clsStudente.js');
var carrieraStudente=require('./Classi/clsCarriera.js');
var controller = Botkit.consolebot({
    debug: true
});

//MODIFICA DEL 17/12/2018
/********* modulo botkit middleware dialogflow */

const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    keyFilename: './botkit-test-7ea2ab19c3d7.json',  // service account private key file from Google Cloud Console
    ignoreType: 'pippo'
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

  //15/01/2019
controller.hears(['Libretto'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
  //console.log('valore di message '+ JSON.stringify(message));
  bot.reply(message, 'sono nel Libretto');
  var replyText='';
  
  
    console.log(JSON.stringify(message.entities));

      ctrlEsseTre.getLibretto().then((libretto)=> {
      replyText='**************** ecco gli esami ';
      if (Array.isArray(libretto)){
       
        for(var i=0; i<libretto.length; i++){

          replyText+='esame di ' +   libretto[i].adDes+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
          libretto[i].annoCorso + ', ' ;

        }
      }
      bot.reply(message, replyText)
      //console.log('risposta statica da DF '+ replyText);
    });
 
});
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
//qui ascolto la chat senza passare per DF
  controller.hears('pippo', 'message_received', function(bot, message) {

    bot.reply(message, 'provo...');
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
   // verifica 24/12/2018 contesto fulfillment ecc
   controller.hears(['Get Employee ID'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
    var replyText='';
   // console.log('valore di message '+ JSON.stringify(message));
    console.log('________________________________');
    console.log('intent è fallback? ' +  message.nlpResponse.queryResult.intent.isFallback);
    /* output è:
    {"fulfillmentMessages":[{"platform":"PLATFORM_UNSPECIFIED","text":{"text":["Thanks, I have noted down your Employee ID which is AAAAAA. Can you please confirm if this is correct?"]},"message":"text"}],"outputContexts":[{"name":"projects/botkit-test/agent/sessions/0933c1f8922a594dc0c4834f9bdbde2f/contexts/getemployeeid-followup","lifespanCount":2,"parameters":{"fields":{"employeeID":{"stringValue":"AAAAAA","kind":"stringValue"},"employeeID.original":{"stringValue":"AAAAAA","kind":"stringValue"}}}}],"queryText":"the id is AAAAAA","speechRecognitionConfidence":0,"action":"","parameters":{"fields":{"employeeID":{"stringValue":"AAAAAA","kind":"stringValue"}}},"allRequiredParamsPresent":true,"fulfillmentText":"Thanks, I have noted down your Employee ID which is AAAAAA. Can you please confirm if this is correct?","webhookSource":"","webhookPayload":null,"intent":{"inputContextNames":[],"events":[],"trainingPhrases":[],"outputContexts":[],"parameters":[],"messages":[],"defaultResponsePlatforms":[],"followupIntentInfo":[],"name":"projects/botkit-test/agent/intents/6b28dd52-364c-406e-a97e-df3573c74961","displayName":"Get Employee ID","priority":0,"isFallback":false,"webhookState":"WEBHOOK_STATE_UNSPECIFIED","action":"","resetContexts":false,"rootFollowupIntentName":"","parentFollowupIntentName":"","mlDisabled":false},"intentDetectionConfidence":1,"diagnosticInfo":{"fields":{"webhook_latency_ms":{"numberValue":63,"kind":"numberValue"}}},"languageCode":"en"}
    */
    console.log('________________________________')
    console.log('queste le entities '+ JSON.stringify(message.entities));
    console.log('________________________________'); 
    //DEBUG: queste le entities {"employeeID":"AAAAAA"}

    /* console.log('valore di nplresponse '+ message.nplResponse);
    if (message.intent) {
      replyText = message.intent;
      console.log('valore di replyText INTENT in Get Employee ID da DG '+ replyText)
      }
    if (message.payload) {
      replyText = message.payload;
      console.log('valore di replyText PAYLOAD in Get Employee ID da DG '+ replyText)
      }
    if (message.action) {
      replyText = message.action;
      console.log('valore di replyText in ACTION di  Get Employee ID da DG '+ replyText)
    }*/
    if (message.fulfillment) {
      replyText = message.fulfillment.text;
    console.log('valore di replyText in FULFILLMENT text di  Get Employee ID da DG '+ replyText)
    }
  
   
 });
  



