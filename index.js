import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv'; dotenv.config();
import Joi from 'joi';
import { MongoClient } from 'mongodb';


const app = express();
app.use(express.json(), cors());

const client = new MongoClient(process.env.MONGO_URI);

app.post('/register', async (req, res) =>{
    const userToRegister = req.body;


    try {
        const { error } = await registerSchema.validateAsync(userToRegister);
        await client.connect(); console.log('Connected successfully to server');
        const db = client.db('myWallet'); const collection = db.collection('users');
        const emailVerify = await collection.find({ email: req.body.email}).toArray();
        if (emailVerify.length > 0){
            throw new Error('Email já existente');
        }

        await collection.insertOne(userToRegister);

        res.status(200).send('Registrado no sistema com sucesso');
    } catch (error) { 
        console.log(error);

        res.status(400).send(`${error}`);
    } finally {
        client.close();
    }
})

app.post('/login', async (req, res) =>{
    const userLogin = req.body;

    try { 
        const { error } = await loginSchema.validateAsync(userLogin);

        // ! APÓS VALIDAR O INPUT DO USUÁRIO COMO LOGIN, VERIFICAR SE ELE ESTÁ REGISTRADO NO BANCO DE DADOS...
        await client.connect(); console.log('Connected successfully to server');
        const db = client.db('myWallet'); const collection = db.collection('users');
        

        res.status(200).send('Ok logou')
    } catch (error) {
        


        res.status(400).send('Deu ruim'); console.log(error);
    } finally {
        client.close();
    }
})









app.listen(process.env.PORT_EXPRESS, console.log(`Server online at: http://localhost:${process.env.PORT_EXPRESS}`));


// & SCHEMAS JOI

const loginSchema = Joi.object({
    email: Joi.string().pattern(/\S+@\S+\.\S+/).required(),
    password: Joi.string().pattern(/.{6,21}/).required()
});

const registerSchema = Joi.object({
    name: Joi.string().pattern(/[a-zA-Z]{4,}/).required(),
    email: Joi.string().pattern(/\S+@\S+\.\S+/).required(),
    password: Joi.string().pattern(/.{6,21}/).required()
})





  // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   const collection = db.collection('documents');