import express from 'express';  
import dotenv from 'dotenv';
import {createProxyMiddleware} from 'http-proxy-middleware'
dotenv.config();


const app = express();  

app.use(express.json());


app.use('/api/v1/users', createProxyMiddleware({target:"http://localhost:2001",changeOrigin:true}));





app.listen(process.env.PORT,()=>{
    console.log(`API Gateway running on port ${process.env.PORT}`);
});


