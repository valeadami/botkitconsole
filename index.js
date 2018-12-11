var Botkit = require('./lib/Botkit.js');
var os = require('os');
var getRemoteData=require('./lib/myModules/somma');
var utOnBoarding=['ciao', 'ciao ciao'];
var utPrenotazione=['(.*) prenotare (.*)', 'prenotare esame (.*)', 'appello di  (.*)','(.*) appello di  (.*)' ];
var utFine=['stop', 'basta','fine','termina','esci','exit'];
var utHelp=['help','aiuto','aiutami','ho bisogno di aiuto','help me','guida'];
var respHelp="sono qui per aiutarti";
var respGuida="sono qui per guidarti all'uso di Essetre. Dì ad esempio o digita prenotazione dell'esame di matematica per prenotare un appello, oppure risultati appello matematica per visualizzare il voto dell'esame di matematica, oppure libretto per conoscere la tua carriera";
var username='';
var password='';
var controller = Botkit.consolebot({
    debug: true,
});

var bot = controller.spawn();
//lifecycle convo events
controller.on('conversationStarted', function(bot, convo) {
    console.log('----------------> A conversation started with ', convo.context.user);
  });
  controller.on('conversationEnded', function(bot, convo) {
    console.log('<----------------- A conversation ended with ', convo.context.user);
  });
  //hears

controller.hears(utOnBoarding, 'message_received', function(bot, message) {

    
            bot.reply(message, 'Ciao sono il bot dell \' università di Trieste. Puoi accedere a EsseTre vedere il tuo libretto, prenotare un esame o vedere l\'esito di un esame');
        
    
});
//trigger 
controller.hears(utHelp, 'message_received', function(bot, message) {
    // this event can be triggered whenever a user needs help
    controller.trigger('help_request', [bot, message]);
  });
  
  controller.on('help_request', function(bot, message) {
  
    bot.reply(message,respHelp);
    bot.createConversation(message, (err,convo)=>{
        convo.say(respGuida);
        convo.activate();
    });
  
  });
  //modifica del 11/12/2018
  controller.hears('prenotare esame', 'message_received', function(bot, message) {

    bot.createConversation(message, (err, convo) => {
        
       
      //qui lo status della convo è new e sono nel thread default
        convo.addMessage({text:"fai login per accedere a essetre. Ti chiedo di dire il tuo username e la tua password ", action:"my_question"}, 'default');
       
        convo.addQuestion('Qual’è la tua username?', [
            {
                pattern: 's[0-9]', //pattern
                callback: function(response, convo) {
                     // verificare la validità della username
                       convo.next();
  
                }
            },
            {
                pattern: 'annulla',
                callback: function(response, convo) {
                   
                  
                    convo.gotoThread('menu');
                    convo.next();
                }
        
          
            },
            {
                default: true,
                callback: function(response, convo) {
                    convo.repeat();
                    convo.next();
                }
            }
    ], {'key': 'username'}, 'my_question');
       //creo il thread goodbye
       convo.addQuestion('Qual’è la tua password?', [
        {
            pattern: '[0-9]', //pattern
            callback: function(response, convo) {
                 // verificare la validità della pwd
                   convo.next();

            }
        },
        {
            pattern: 'annulla',
            callback: function(response, convo) {
               
              
                convo.gotoThread('menu');
                convo.next();
            }
    
      
        },
        {
            default: true,
            callback: function(response, convo) {
                convo.repeat();
                convo.next();
            }
        }
], {'key': 'password'}, 'my_question');
 
        convo.activate();


        convo.addMessage('ok ora ti connetto a essetre', 'my_question');
        convo.addMessage('ok torno al menu', 'menu');
         convo.on('end', function(convo) {
             console.log('sono in convo.end, lo status della convo = '+ convo.status)
             //username=convo.extractResponse('username');
             var res=convo.extractResponses();
             console.log('username =' + res.username +' , mentre password ' + res.password);
            // bot.reply(message, 'ora stoppo la convo');
            
             
            });
    });
 });

 //esempi del manuale Botkit
 //*****************DEFINIRE UN THREAD *********************** */
 controller.hears('testazione1', 'message_received', function(bot, message) {
    bot.createConversation(message, (err, convo) => {
         convo.setVar('threadname',"next_step");
// first, define a thread called `next_step` that we'll route to...
        convo.addMessage({text: 'This is the next step...',},'next_step');
    // send a message, and tell botkit to immediately go to the next_step thread
        convo.addMessage({
            text: 'Anyways, moving on...',
            action: 'next_step' /* -----------> imposta AZIONE */
    });
    convo.activate();
    convo.on('end', function(convo){
        console.log('sono in end di testazione1');
    });
 });
});

controller.hears('testazione2', 'message_received', function(bot, message) {
    bot.createConversation(message, (err, convo) => {
     // create a path for when a user says YES
     convo.addMessage({text: 'You said yes! How wonderful.',},'yes_thread');
    // create a path for when a user says NO
    convo.addMessage({text: 'You said no, that is too bad.',},'no_thread');
      // create a path where neither option was matched
    // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
    convo.addMessage({text: 'Sorry I did not understand.', action: 'default',},'bad_response');
    // Create a yes/no question in the default thread...
    convo.addQuestion('Do you like cheese?', [
        {
            pattern: 'yes',
            callback: function(response, convo) {
                convo.gotoThread('yes_thread');
            },
        },
        {
            pattern: 'no',
            callback: function(response, convo) {
                convo.gotoThread('no_thread');
            },
        },
        {
            default: true,
            callback: function(response, convo) {
                convo.gotoThread('bad_response');
            },
        }
    ],{},'default');

    convo.activate();
    convo.on('end', function(convo){
        console.log('sono in end di testazione2');
    });
 });
});

 //fine esempi manuale
//fine modifica del 11/12/2018 
//modifica del 10/12/2018
controller.hears(utPrenotazione, 'message_received', function(bot, message) {

    bot.createConversation(message, (err, convo) => {
        //test di setVar
        convo.setVar('foo', "bar");
      //qui lo status della convo è new e sono nel thread default
        convo.addMessage({text:"hi there "+ convo.status, action:"my_question"}, 'default');
        
        convo.addQuestion('How about  {{vars.foo}}?', [
            {
                pattern: 'si',
                callback: function(response, convo) {
                    // since no further messages are queued after this,
                    // the conversation will end naturally with status == 'completed'
                    convo.gotoThread('goodbye_message')
                   
                    convo.next();
                }
            },
            {
                pattern: 'no',
                callback: function(response, convo) {
                    convo.setVar('foo', "buzz");
                   
                    convo.gotoThread('my_question');
                    convo.next();
                }
         
           
            }
    ], {}, 'my_question');
       //creo il thread goodbye
        convo.addMessage("sono nel thread goodbye e la convo si trova nello status "+convo.status, 'goodbye_message');

        convo.activate();

         convo.on('end', function(convo) {
             console.log('sono in convo.end, lo status della convo = '+ convo.status)
             bot.reply(message, 'ora stoppo la convo');
             
              
            });
    });
});

controller.hears(['cosa posso (.*)', 'che cosa (.*)', 'quali operazioni posso fare'], 'message_received', function(bot, message) {

    
    bot.reply(message, 'Puoi vedere il tuo libretto, prenotare un esame o vedere l\'esito di un esame');
    bot.startConversation(message, function(err, convo) {
        if (!err) {
            
            convo.ask('cosa vuoi fare', function(response, convo) {
                convo.ask('vuoi che proceda con `' + response.text + '`?', [
                    {
                        pattern: 'si',
                        callback: function(response, convo) {
                            // since no further messages are queued after this,
                            // the conversation will end naturally with status == 'completed'
                            convo.next();
                        }
                    },
                    {
                        pattern: 'no',
                        callback: function(response, convo) {
                            // stop the conversation. this will cause it to end with status == 'stopped'
                            convo.stop();
                        }
                    },
                    {
                        default: true,
                        callback: function(response, convo) {
                            convo.repeat();
                            convo.next();
                        }
                    }
                ]);

                convo.next();

            }, {'key': 'nickname'}); // store the results in a field called nickname

            convo.on('end', function(convo) {
                if (convo.status == 'completed') {
                    bot.reply(message, 'OK! procedo!');

                    controller.storage.users.get(message.user, function(err, user) {
                        if (!user) {
                            user = {
                                id: message.user,
                            };
                        }
                        user.name = convo.extractResponse('nickname');
                       
                        controller.storage.users.save(user, function(err, id) {
                            bot.reply(message, 'Procedo con ' + user.name);
                        });
                    });
                    let sp='';
                    getRemoteData('http://86.107.98.69:8080/AVA/rest/searchService/search_2?searchText=ciao&user=&pwd=&ava=FarmaInfoBot').then((response) => {
                        const data = JSON.parse(response);
                        //console.log('data = ' + JSON.stringify(data));
                       // sp += 'There are currently '+data.people.length+  ' astronauts in space';
                        sp+=data.output[0].output;
                       // console.log('sp=' + sp);
                       convo.setVar('esame', sp)
                        bot.reply(message, '****PUOI PRENOTARE ESAME ' + sp);
                    });

                } else {
                    // this happens if the conversation ended prematurely for some reason
                    bot.reply(message, 'OK, nevermind!');
                }
            });
        }
    });

});

controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});
controller.hears(utFine, 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.setVar('foo','bar');
        /* convo.setVar('list',[{value:'option 1'},{value:'option 2'}]);
        convo.setVar('object',{'name': 'Chester', 'type': 'imaginary'});
       The items in this list include {{#vars.list}}{{value}}{{/vars.list}}

The object's name is {{vars.object.name}}.

{{#foo}}If foo is set, I will say this{{/foo}}{{^foo}}If foo is not set, I will say this other thing.{{/foo}}*/
         convo.ask('Are you sure you want me to stop? ' + 'stato convo '+ convo.status, [
             {
                 pattern: bot.utterances.yes,
                 callback: function(response, convo) {
                     convo.say('Bye!');
                     convo.next();
                     setTimeout(function() {
                         process.exit();
                     }, 3000);
                 }
             },
         {
             pattern: bot.utterances.no,
             default: true,
             callback: function(response, convo) {
                 convo.say('*Phew!*');
                 convo.next();
             }
         }
         ]);
 
             // create an end state thread
 /*convo.addMessage('This is the end!', 'the_end');
 
 // now transition there with a nice message
 convo.transitionTo('the_end','Well I think I am all done. Bye!');*/
     });
 
 });

controller.hears(['question me'], 'message_received', function(bot,message) {

    // start a conversation to handle this response.
    bot.startConversation(message,function(err,convo) {
  
      convo.addQuestion('How are you?',function(response,convo) {
  
        convo.say('Cool, you said: ' + response.text);
        convo.next();
  
      },{},'default');
     
    })
  
  });


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'message_received', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am ConsoleBot. I have been running for ' + uptime + ' on ' + hostname + '.');

    });


function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}



    /* PARTI OLD DEL PROGETTO ORIGINALE
controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});*/