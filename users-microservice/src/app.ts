import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bullmq";
import dotenv from "dotenv";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import CreateHttpError from "http-errors";

import AuthUserController from "./controller/UserController";
import ConnectToDatabase from "./mongoose/mongoose.connection";
import { connection } from "./redis/bull_mq.connection";
import { RegisterationValidator } from "./validator/Registeration.validator";
import { myWorker } from "./worker/OrderWorker";

const app = express();

//Error Handler Middleware 
const errorHandler : ErrorRequestHandler = (err, req, res, next) => {   
    res.status(err.status || 500).
    json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    }); 
};
const orderQueue = new Queue('order-sample', { connection });
const serverAdapter = new ExpressAdapter();

dotenv.config();

app.use(express.json());

serverAdapter.setBasePath("/admin/queues");

app.use("/admin/queues", serverAdapter.getRouter());

app.post('/order', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request data
        const order = await RegisterationValidator.validateAsync(req.body);

        // Add job to queue with order data
        const job = await orderQueue.add('new-order', order);

         myWorker()

        res.json({ 
            success: true, 
            message: "Order processing job added to queue", 
            jobId: job.id 
        });

    } catch (error) {
        next(error);  // Passes error to Express error handler
    }
})

// ✅ Fix User Registration Endpoint
app.post('/api/v1/register', (req : Request,res : Response ,next: NextFunction) => {
   console.log('Register User');
    AuthUserController.createUser(req,res,next);  
  // res.send('Register User');   
}
);

app.post('/login', (req: Request, res: Response) => {
    res.send('Users Login service running');
});

// 404 Handling
app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateHttpError(404, `Not Found from the user : ${req.baseUrl}`));
});

app.use(errorHandler);

// ✅ Handle Database Connection Errors
ConnectToDatabase()
    .then(() => {
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Users service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });
