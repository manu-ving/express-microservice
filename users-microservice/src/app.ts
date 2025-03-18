import cors from 'cors';
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import CreateHttpError from "http-errors";
import { apiLimiter, verifyApiKey } from './helpers/RequestLimiter';
import ConnectToDatabase from "./mongoose/mongoose.connection";
import routers from './routes/Auth.Routes';
import { errorHandler } from './routes/ErrorHandling';
import {myWorker} from "./worker/OrderWorker";
import productRouter from "./routes/Product.routes";
import productRoutes from "./routes/Product.routes";
const app = express();
dotenv.config();

app.use(express.json());
// ✅ Apply middleware only to /api/v1 routes

app.use(cors())
app.use('/api/v1', verifyApiKey, apiLimiter, routers);
// TODO implement auth checking
app.use('/api/v1/products',verifyApiKey,apiLimiter,productRoutes);



// ✅ Handle Database Connection Errors
ConnectToDatabase()
    .then(() => {
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Users service running on port ${PORT}`);
            //start listening for que jobs
            myWorker();

            //this
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });



    // 404 Handling
app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateHttpError(404, `Not Found from the user : ${req.baseUrl}`));
});

app.use(errorHandler);

