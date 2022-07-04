import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv'; dotenv.config();
import routes from './routes/routes.js';
import db from './db.js';


const app = express();
app.use(express.json(), cors());

app.use(routes);

function deleteUsersInatived (){
    setInterval( async ()=>{

        try {
            const sessions = await db.collection('sessions').find().toArray();
        
            for(let i = 0; i < sessions.length; i++){
                const currentTime = Date.now() / 60000;

                const minutesPassed = sessions[i].lastStatus / 60000;

                if(currentTime - minutesPassed > 15){
                    const sessionToRemove = sessions[i]._id;
                    await db.collection('sessions').deleteOne({ _id: sessionToRemove });
                }
            }
        } catch (error) {
            res.send(`${error}`)
            console.log(error)
        }
    }, 900000);
}


deleteUsersInatived();


app.listen(process.env.PORT, console.log("Server running on port " + process.env.PORT));