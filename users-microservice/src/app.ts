import express,{Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();    

app.use(express.json());    
app.use(express.urlencoded({extended:false}));



app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.send('Users service running');
}); 


app.listen(process.env.PORT,()=>{
    console.log(`Users service running on port ${process.env.PORT}`);
});
