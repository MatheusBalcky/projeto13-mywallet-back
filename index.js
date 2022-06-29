import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv'; dotenv.config();
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';


const app = express();
app.use(express.json(), cors());

const client = new MongoClient(process.env.MONGO_URI);

app.post('/register', async (req, res) =>{
    const userToRegister = req.body;

    try {
        const { error } = registerSchema.validate(userToRegister);
        if(error){  throw new Error('Dados inválidos, preencha os campos corretamente')  };

        await client.connect(); console.log('Connected successfully to server');
        const db = client.db('myWallet'); const collection = db.collection('users');

        const emailVerify = await collection.find({ email: req.body.email}).toArray();
        if (emailVerify.length > 0){  throw new Error('Email já existente') };

        const passwordCrypted = bcrypt.hashSync(userToRegister.password,10)

        await collection.insertOne({
            ...userToRegister,
            password: passwordCrypted
        });

        res.status(200).send('Registrado no sistema com sucesso');
    } catch (error) { 

        res.status(400).send(`${error}`);
    } finally {
        client.close();
    }
})

app.post('/login', async (req, res) =>{
    const userLogin = req.body;

    try { 
        const { error } = await loginSchema.validateAsync(userLogin);
        console.log(error)
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
    name: Joi.string().pattern(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/.{6,21}/).required()
})





  // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   const collection = db.collection('documents');