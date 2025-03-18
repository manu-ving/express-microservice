import {Worker} from 'bullmq';
import {connection} from "../redis/bull_mq.connection";
import {SendMail} from "../helpers/nodeMailer";

// ✅ Correcting the sendEmail function

export function myWorker(): Worker {
    return new Worker(
        'email-queue',
        async (job) => {
            try {
                console.log("🚀 Worker Starting...");
                console.log(`🔄 Processing Job ID: ${job.id}`);

                // Extract data from the job
                const {toEmailAddress, emailSubject, emailText, htmlText} = job.data;

                console.log("📧 Sending Email...to " + toEmailAddress);

                await SendMail(
                    toEmailAddress,
                    emailSubject,
                    emailText,
                    htmlText,
                );

                console.log("✅ Email Sent to Client!");
            } catch (error) {
                console.error(`❌ Error processing job ${job.id}:`, error);
            }
        },
        {connection}
    );
}



