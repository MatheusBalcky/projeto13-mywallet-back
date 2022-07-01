import db from "../db.js";
import dayjs from "dayjs";

export async function enterController (req, res){
    console.log('teste de etnrada')
    const bodyEnter = req.body;
    const userSession = res.locals.userSession;
    
    try {
        await db.collection('entersandouts').updateOne(
            { from: userSession.userId },
            {
                $push: { entersandouts: {
                    type: 'enter',
                    ...bodyEnter,
                    date: dayjs().format('DD/MM/YYYY'),
                }}
            });
        
        
        res.sendStatus(200)
    } catch (error) {
        res.status(400).send(`${error}`)
    }



    //db.collection('entersandout').findOne({})
    
}

export async function outController (req, res){
    const bodyEnter = req.body;
    const userSession = res.locals.userSession;

    try {
        await db.collection('entersandouts').updateOne(
            { from: userSession.userId },
            {
                $push: { entersandouts: {
                    type: 'out',
                    ...bodyEnter,
                    date: dayjs().format('DD/MM/YYYY'),
                }}
            });
        
        
        res.sendStatus(200)
    } catch (error) {
        res.status(400).send(`${error}`)
    }

}