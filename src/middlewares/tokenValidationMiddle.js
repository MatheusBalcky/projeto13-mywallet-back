import db from "../db.js";


export async function tokenValidationMiddle (req, res, next){
    try {
        const tokenUser = req.headers.authorization;

        if(!tokenUser){ return res.sendStatus(400) };
    
        const userSession = await db.collection('sessions').findOne({ token: tokenUser});
        if(!userSession){ return res.sendStatus(400)}
    
        res.locals.userSession = userSession;

        next();
    } catch (error) {
        res.status(400).send(`${error}`)
    }

}