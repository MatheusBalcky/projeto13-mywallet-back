import { enterOutSchema } from "../schemas/enterAndOutSchema.js";
import db from "../db.js";

export async function userValidationMiddleware (req, res, next) {
    try {
        const bodyEnter = req.body;
        const tokenUser = req.headers.authorization;
        const { error } = enterOutSchema.validate(bodyEnter);
    
        if(error || !tokenUser){ return res.sendStatus(400) }
    
        const userSession = await db.collection('sessions').findOne({ token: tokenUser});
        if(!userSession){ return res.sendStatus(400)}

        res.locals.userSession = userSession;

        next();
    } catch (error) {
        res.status(400).send(`${error}`)
    }
}