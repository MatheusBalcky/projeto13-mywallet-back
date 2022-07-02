import { enterOutSchema } from "../schemas/enterAndOutSchema.js";

export async function valuesValidationMiddle (req, res, next) {
    try {
        const bodyEnter = req.body;
        const { error } = enterOutSchema.validate(bodyEnter);
    
        if(error){ return res.sendStatus(400) }

        next();
    } catch (error) {
        res.status(400).send(`${error}`)
    }
}