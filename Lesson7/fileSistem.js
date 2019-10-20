const fs = require('fs');

fs.readFile('./catalog.json', 'utf-8', (err, data) => {
   if (err) {
       console.log(err);
   }


   const item =  {
           id: 5,
           title: 'Флешка',
           price: 3000,
           quantity: 1
       }
   ;
    const parsedData = JSON.parse(data);
    parsedData.push(item);

    fs.writeFile('./catalog.json', JSON.stringify(parsedData), (err) => {
        console.log('Данные обновлены');
    });


});