const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('./'));
app.use(express.json());


app.get('/goods', (req, res) => {
   fs.readFile('./catalog.json', 'utf-8', (err, data) => {
    res.send(data);
   });
});

app.get('/cart', (req, res) => {
   fs.readFile('./cart.json', 'utf-8', (err, data) => {
    res.send(data);
   });
});

app.post('/cart', (req, res) => {
    fs.readFile('./cart.json', 'utf-8', (err, data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.some((item) => +item.id === +req.body.id)) {
            return res.status(500);
        }
        parsedData.push(req.body);
        fs.writeFile('./cart.json', JSON.stringify(parsedData), err => {
            res.send(req.body);
        })
    });
});

app.patch('/cart/:id', (req, res) => {
    fs.readFile('./cart.json', 'utf-8', (err, data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.every((item) => +item.id !== +req.params.id)) {
            return res.status(500).send({});
        }

        const cartItemIdx = parsedData.findIndex((cartItem) => +cartItem.id === +req.params.id);
        parsedData[cartItemIdx].quantity = req.body.quantity;


        fs.writeFile('./cart.json', JSON.stringify(parsedData), err => {
            res.send(parsedData[cartItemIdx]);
        })
    });
});

app.delete('/cart/:id', (req, res) => {
    fs.readFile('./cart.json', 'utf-8', (err, data) => {
        debugger;
        const parsedData = JSON.parse(data);
        // console.log(req.params);
        if (parsedData.every((item) => +item.id !== +req.params.id)) {
            return res.status(500);
        }

        const index = parsedData.findIndex(item => +item.id === +req.params.id);
        parsedData.splice(index, 1);

        fs.writeFile('./cart.json', JSON.stringify(parsedData), err => {
            res.send(parsedData);
        })
    });
});
app.listen(3000);
