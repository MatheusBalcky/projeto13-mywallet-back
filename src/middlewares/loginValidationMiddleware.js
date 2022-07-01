import loginSchema from "../schemas/loginSchema.js";
import db from "../db.js";
import bcrypt from 'bcrypt';

export async function loginValidationMiddleware (req, res, next){
    console.log('middlelogin...')

    const userLogin = req.body;

    try { 
        const { error } = loginSchema.validate(userLogin);
        const verifyEmail = await db.collection('users').findOne({ email: userLogin.email});

        if(error || !verifyEmail || !bcrypt.compareSync(userLogin.password, verifyEmail.password)){
            throw ('E-mail ou senha incorretos!');
        };

        res.locals.verifyEmail = verifyEmail;

        next ();
    } catch (error) {
        res.status(400).send(`${error}`);
    }

}