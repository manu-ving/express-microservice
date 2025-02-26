import express,{Request,Response,NextFunction} from 'express';  
import dotenv from 'dotenv';
import {createProxyMiddleware} from 'http-proxy-middleware'

dotenv.config();


const app = express();  

app.use(express.json());


app.use('/api/v1/users', createProxyMiddleware({target:"https://express-microservice-1.onrender.com/",changeOrigin:true}));


app.get('/',(req : Request,res : Response , next : NextFunction) =>{
    res.send('API Gateway running');
}   );




app.listen(process.env.PORT,()=>{
    console.log(`API Gateway running on port ${process.env.PORT}`);
});


