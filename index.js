import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv'; dotenv.config();
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';


const app = express();
app.use(express.json(), cors());

const client = new MongoClient(process.env.MONGO_URI);

app.post('/register', async (req, res) =>{
    const userToRegister = req.body;

    try {
        const { error } = registerSchema.validate(userToRegister);
        if(error){ throw new Error('Dados preenchido incorretamente')  };
        
        // & CONNECTING WITH MONGO
        await client.connect(); console.log('Connected successfully to server');
        const db = client.db('myWallet'); 
        const collection = db.collection('users');
        // & CONNECTED...

        const emailVerify = await collection.findOne({ email: req.body.email});
        if (emailVerify){  throw new Error('Email já existente') };

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
    const token = uuid();

    try { 
        const { error } = loginSchema.validate(userLogin);
        if(error){
            throw ('Dados incorreto')
        };

        await client.connect(); console.log('Connected successfully to server');
        const db = client.db('myWallet'); 
        const collUsers = db.collection('users');
        const collSessions = db.collection('sessions');

        const verifyEmail = await collUsers.findOne({ email: userLogin.email});
        
        if(!verifyEmail || !bcrypt.compareSync(userLogin.password, verifyEmail.password)){
            throw ('E-mail ou senha incorretos!')
        };
        
        await collSessions.insertOne({
            userId: verifyEmail._id,
            token,
        })

        console.log(chalk.green('Logado'));
        res.status(200).send({
            token,
            user: {
                email: verifyEmail.email,
                name: verifyEmail.name
            }
        });

    } catch (error) {

        res.status(400).send(`${error}`);

    } finally {
        client.close();
    }
})









app.listen(process.env.PORT_EXPRESS, console.log(`Server online at: http://localhost:${process.env.PORT_EXPRESS}`));


// & SCHEMAS JOI

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/.{6,21}/).required()
});

const registerSchema = Joi.object({
    name: Joi.string().pattern(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/.{6,21}/).required()
})





  // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   const collection = db.collection('documents');