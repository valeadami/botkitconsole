// file somma.js
function  getRemoteData (url) {
    return new Promise((resolve, reject) => {
        
      const client = url.startsWith('https') ? require('https') : require('http');
      
      //console.log(`**********Sono dentro getRemoteData`);
      const request = client.get(url, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed with status code: ' + response.statusCode));
         // console.log('errore');
        }
        const body = [];
        response.on('data', (chunk) => body.push(chunk));
        //console.log('OK');
        response.on('end', () => resolve(body.join('')));
      });
      request.on('error', (err) => reject(err))
    })
  };
function isNumber(number) {
    return typeof(number) === 'number';
  }
  
  function somma(addendo1, addendo2) {
    return addendo1 + addendo2;
  }
  
  if (require.main === module) {
    // file eseguito con il comando 'node somma.js'
    const args = process.argv.slice(2);
    const [
      addendo1, 
      addendo2
    ] = args.map(value => parseInt(value) || 'Invalid argument');
  
    if (isNumber(addendo1) && isNumber(addendo2)) {
       console.log( somma(addendo1, addendo2) );
    } else {
      console.log(`
        Errore: 
          addendo1 -> ${addendo1}
          addendo2 -> ${addendo2}
  
        *************************************************
  
        Uso: node somma.js addendo1 addendo2
  
        Esempio: node somma.js 1 2 // esegue la somma 1+2
        `
      );
    }
  } else {
    /* gli altri moduli potranno usare la funzione somma() 
    *  ma non potranno invocare direttamente la funzione isNumber()
    */ 
    module.exports = somma;
  
  }
  module.exports=getRemoteData;