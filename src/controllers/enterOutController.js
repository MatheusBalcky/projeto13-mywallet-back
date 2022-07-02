import db from "../db.js";
import dayjs from "dayjs";

export async function enterController (req, res){
    console.log('Controle da rota de entrada foi...')
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

export async function getEntersAndOutsController (req, res){
    const userSession = res.locals.userSession;

    const entersAndOuts = await db.collection('entersandouts').findOne({from: userSession.userId});
    const onlyValue = entersAndOuts.entersandouts;
    res.status(200).send(onlyValue);
}