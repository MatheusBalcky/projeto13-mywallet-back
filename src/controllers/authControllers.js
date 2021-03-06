import db from "../db.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function registerController (req, res){
    const userToRegister = res.locals.userToRegister;
    console.log(userToRegister);

    try {
        const passwordCrypted = bcrypt.hashSync( userToRegister.password, 10 );

        await db.collection('users').insertOne({
            ...userToRegister,
            password: passwordCrypted
        });

        const idUser = await db.collection('users').findOne({ email: userToRegister.email});

        await db.collection('entersandouts').insertOne({
            from: idUser._id,
            email: idUser.email,
            entersandouts: []
        });

        res.status(200).send('Registrado no sistema com sucesso');
    } catch (error) { 

        res.status(400).send(`${error}`);
    }
}

export async function loginController (req, res){
    const token = uuid();
    const verifyEmail =  res.locals.verifyEmail;

    try { 
        
        await db.collection('sessions').insertOne({
            userId: verifyEmail._id,
            token,
            lastStatus: Date.now()
        })

        // & DEVOLVE ALGUNS DADOS NECESSÁRIO LÁ NO FRONT, ALÉM DO TOKEN
        res.status(200).send({
            token,
            user: {
                email: verifyEmail.email,
                name: verifyEmail.name
            }
        });

    } catch (error) {

        res.status(400).send(`${error}`);
    }
}