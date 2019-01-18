var Botkit = require('./lib/Botkit.js');
var os = require('os');
var getRemoteData=require('./lib/myModules/somma');
var myConvo=require('./Conversation');
//************************** gestione classi */
var ctrlEsseTre=require('./Classi/clsControllerS3.js');
var studente=require('./Classi/clsStudente.js');
var carrieraStudente=require('./Classi/clsCarriera.js');

var controller = Botkit.consolebot({
    debug: true,
});

//MODIFICA DEL 17/12/2018
/********* modulo botkit middleware dialogflow */

const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    keyFilename: './botkit-test-43930ebfe242.json',  // service account private key file from Google Cloud Console PER QUESTO PC
   // ignoreType:['si','no', myConvo.utOnBoarding,'pippo','pluto','minnie']
  //  debug: true
     //ignoro alcune parole ma parte la richiesta a DF al si di risposta del login   ['si','no', myConvo.utOnBoarding,'pippo','pluto','minnie']
  });

//******************* */

var bot = controller.spawn();

//funzione di test 


//controller.middleware.receive.use(myTest); 

/*Receive middleware can be used to do things like preprocess the message content using external natural language processing services like Wit.ai. 
Additional information can be added to the message object for use down the chain.
*/
controller.middleware.receive.use(dialogflowMiddleware.receive);

/* Send middleware can be used to do things like preprocess the message content before it gets sent out to the messaging client.*/

//controller.middleware.send.use(dialogflowMiddleware.use);

//lifecycle convo events
controller.on('conversationStarted', function(bot, convo) {
    console.log('----------------> A conversation started with ', convo.context.user);
  });
  controller.on('conversationEnded', function(bot, convo) {
    console.log('<----------------- A conversation ended with ', convo.context.user + " message " + convo.message);
    
  });
  //********************************* GESTITO DAL BOT  ***************************/
  //hears 
  controller.hears('hello', 'message_received', function (bot, message) {

    /* onboarding */
    bot.reply(message, 'here  in onBoarding');
   

// creo la conversazione
    bot.createConversation(message, (err, convo) => {
    
      // DEFINISCO I THREAD
      convo.addMessage({ text: myConvo.botOnBoarding.respLogin }, 'login_thread');
      convo.addMessage({ text: myConvo.botOnBoarding.respOnBoarding }, 'default');
      convo.addMessage({ text: myConvo.respMenu }, 'menu_thread');
    
 
      
      // Create a yes/no question in the default thread...

      convo.addQuestion(myConvo.botQuestions.questLogin, [

          {
              pattern: 'si', //yes
              callback: function (response, convo) {
                  console.log('****************************dentro la callback di si');
                  convo.gotoThread('login_thread');
                  convo.next();
              },
          },
          {
              pattern: 'no', //no
              callback: function (response, convo) {
                  convo.gotoThread('stop_thread');
                  convo.next();
              },
          },
         
          {
              default: true,
              callback: function (response, convo) {
                 // convo.gotoThread('default_thread');
                  convo.repeat();
                  convo.next();
              },
          }
      ], { 'key': 'scelta' }, 'default');
     
    //MENU LOGIN
    convo.addQuestion({ text: myConvo.botQuestions.questPrenUsername }, [
      {
          pattern: 's[0-9]', //pattern
          callback: function (response, convo) {
              // verificare la validità della username
              convo.next();

          }
      }], { 'key': 'username' }, 'login_thread');

  //chiedo la password 
  convo.addQuestion(myConvo.botQuestions.questPrenPassword, [
      {
          pattern: '[0-9]', //pattern
          callback: function (response, convo) {
              // verificare la validità della pwd
              convo.gotoThread('menu_thread');
              convo.next();

          }
      }], { 'key': 'password' }, 'login_thread');


      // MENU THREAD ************* COMMENTATO LA PRENOTAZIONE E AGGIUNTO LIBRETTO IN DATA 14/01/2019
  convo.addQuestion({text:(myConvo.botQuestions.questMenu)},  [

     /* {
          pattern: 'prenotazione',
          callback:function(response, convo){
              convo.gotoThread('prenotazione_thread');
              convo.next();
          }
      },*/
      {
        pattern: 'libretto',
        callback:function(response, convo){
            convo.gotoThread('libretto_thread');
            convo.next();
        }
    },
      {
          pattern: 'stop',
          callback: function (response, convo) {
              convo.gotoThread('stop_thread');
              convo.next();
          },
      },
      {
          pattern: 'help',
          callback: function (response, convo) {
             // convo.gotoThread('help_thread');
              
              convo.say(respGuida);
              convo.gotoThread('menu_thread');
              convo.next();
          },
      },
  ], {'key':'prenotazione'},'menu_thread');

  //LIBRETTO  THREAD AGGIUNTO IN DATA 14/01/2019
  convo.addMessage({ text: myConvo.questLibretto }, 'libretto_thread');
  //qui attivo la convo
  convo.activate();
  });
});
/******************************* FINE GESTITO DAL BOT */


  //15/01/2019 ************************* DIALOG FLOW *************************************
  controller.hears(['Libretto'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
    //console.log('valore di message '+ JSON.stringify(message));
    var replyText='';
 
   bot.createConversation(message, (err, convo) => {
    
    // DEFINISCO I THREAD
    convo.addMessage({ text:'test test ' }, 'default');

  
    convo.activate();
    //});
convo.on('end', function (convo) {
    
   // if (message.entities.libretto){
        console.log('sono dentro if message.entities');
        ctrlEsseTre.getLibretto().then((libretto)=> {
            replyText+='**************** ecco il tuo libretto ****************** \n';
            if (Array.isArray(libretto)){
            
              for(var i=0; i<libretto.length; i++){
      
                replyText+=   libretto[i].adDes+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
                libretto[i].annoCorso + '\n ' ;
                }
             }
        
       
            }); 
       // }  
    
    console.log('here in end');

});

});
  
});
   
    
  
      //console.log(JSON.stringify(message.entities));
  /************************* CHIAMATA API REST DI ESSETRE  */
      
 
  //'direct_message'  'message_received'
  controller.hears(['Default Welcome Intent'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
    var replyText = message.fulfillment.text;  // message object has new fields added by Dialogflow
    
    bot.reply(message, replyText);
  });

  controller.hears(['test'], 'message_received', dialogflowMiddleware.hears, function(bot, message) {
  
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
    bot.reply(message, 'here in stop');
    console.log('valore di replyText in stop da DG '+ replyText)

    
   });
   
