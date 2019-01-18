/*  data: 14/01/2019

modulo per le domande e risposte del bot


*/
var Conversation={
    'type':'Conversation',
    'utOnBoarding':'ciao',

    'botOnBoarding':{

        'respOnBoarding':'Ciao! Sono il bot dell’Università degli studi di Trieste. Posso aiutarti a prenotare un appello, vedere il tuo libretto, vedere i risultati di un esame. Per connetterti a essetre ho bisogno delle tue credenziali',
        'respLogin':'Per connetterti a essetre ho bisogno delle tue credenziali',
        'respMenu':'Sei al menu: dì o digita prenotazione per prenotare un appello, libretto per conoscere la tua carriera, esito per conoscere esito di un esame, help per ricevere aiuto, stop per uscire dalla chat',
        'respHelp':'sono qui per aiutarti',
        'respGuida':'"Bene, hai chiesto aiuto! Puoi darmi istruzione via chat o in modalità vocale. Ascolto le tue parole, quindi se vuoi continuare dimmi o scrivi prenotazione, libretto o esito. Per uscire dalla chat dì stop, per annullare un\'operazione dì annulla'
    },
    'botQuestions':{

        'questLogin':'vuoi continuare con il login?',
        'questMenu':'cosa vuoi fare ora?',
        'questLibretto':'che cosa vuoi sapere del libretto?',
        'questUsername':'qual’è la tua username? In genere è nel formato s123456',
        'questPrenPassword':'qual’è la tua password? In genere è composta da otto caratteri alfanumerici, ad esempio Q3VRAAQP',
        'questLogout':'Vuoi uscire?'
    }


}
module.exports=Conversation;
