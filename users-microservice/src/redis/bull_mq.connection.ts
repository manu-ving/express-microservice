import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Redis connection configuration
export  const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null, // ✅ Required for BullMQ workers
});

// Create the Queue
export const emailQueue = new Queue('email-queue', {
    connection,
});

