import { connection } from "../redis/bull_mq.connection";
import { Queue } from 'bullmq'




// Function to add an order job to the queue
export const orderInstance = async (order : any) => {
    const orderQueue = new Queue("order-sample");

    // Adding a job to the queue
    const job = await orderQueue.add("new order", { 
        orderId: "manananan", 
        product: "Samsung TV" 
    });

    console.log("✅ Job Added to Queue:", job.id);
};
