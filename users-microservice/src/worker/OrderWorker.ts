import { Worker } from 'bullmq';
import { connection } from "../redis/bull_mq.connection";

// ✅ Correcting the sendEmail function
const sendEmail = () => new Promise<void>((resolve) => setTimeout(resolve, 5000));



export function myWorker(): Worker {
    return new Worker(
         'order-sample',
         async (job) => {
           try {
             console.log("🚀 Worker Starting...");
             console.log(`🔄 Processing Job ID: ${job.id}`);
             console.log("📧 Sending Email...");
             
             await sendEmail();
       
             console.log("✅ Email Sent to Client!");
           } catch (error) {
             console.error(`❌ Error processing job ${job.id}:`, error);
           }
         },
         { connection }
     );
 }
 

myWorker()