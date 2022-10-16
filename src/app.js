const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here
app.get('/mario', async (req, res) => {
    res.send(await marioModel.find());
});

app.get('/mario/:id', async (req, res) => {
    const id = req.params.id;
    try {
        res.send(await marioModel.findById(id));
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }

});

const isNullOrUndefined = (val) => val === null || val === undefined;

app.post('/mario', async (req, res) => {
    const newMario = req.body;

    if (isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)) {
        res.status(400).send({ message: 'either name or weight is missing' });
    } else {
        const newMarioDocument = new marioModel(newMario);
        await newMarioDocument.save();
        res.status(201).send(newMarioDocument);
    }
});

app.patch('/mario/:id', async (req, res) => {
    const id = req.params.id;
    const newMario = req.body;

    try {
        const exisistingMarioDoc = await marioModel.findById(id);
        if (isNullOrUndefined(newMario.name) && isNullOrUndefined(newMario.weight)) {
            res.status(400).send({ message: 'either name and weight is missing' });
        }
        else {
            if (!isNullOrUndefined(newMario.name)) {
                exisistingMarioDoc.name = newMario.name;
            }
            if (!isNullOrUndefined(newMario.weight)) {
                exisistingMarioDoc.weight = newMario.weight;
            }
            await exisistingMarioDoc.save();
            res.send(exisistingMarioDoc);
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.delete('/mario/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await marioModel.findById(id);
        await marioModel.deleteOne({ _id: id });
        res.status(200).send({ message: 'character deleted' });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = app;