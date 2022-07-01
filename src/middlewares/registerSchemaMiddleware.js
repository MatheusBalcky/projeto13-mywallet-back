import registerSchema from "../schemas/registerSchema.js";
import db from "../db.js";


export async function registerSchemaMiddleWare (req, res, next){
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