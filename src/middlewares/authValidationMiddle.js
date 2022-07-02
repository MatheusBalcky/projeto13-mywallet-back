import loginSchema from "../schemas/loginSchema.js";
import registerSchema from "../schemas/registerSchema.js";
import db from "../db.js";
import bcrypt from 'bcrypt';



export async function loginValidationMiddleware (req, res, next){
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

export async function registerValidationMiddleWare (req, res, next){
    const formRegister = req.body;

    try {
        const { error } = registerSchema.validate(formRegister);
        if(error){ throw new Error('Dados preenchido incorretamente')  };
    
        const emailVerify = await db.collection('users').findOne({ email: formRegister.email});
        if (emailVerify){  throw new Error('Email já existente') };
        
        res.locals.userToRegister = formRegister;

        next();
    } catch (error) {
        res.status(400).send(`${error}`);
    }

}