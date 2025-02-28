import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();


const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;

if(!MONGO_ATLAS_URI){
    throw new Error("❌ MONGO_URI is not defined in the environment variables!");
}


const ConnectToDatabase = async () => {
    try{
        await mongoose.connect(MONGO_ATLAS_URI,{
            //options 
        });
    }catch(error){
        console.error("MongoDb connection Failed :",error);
    }
}

mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully!");
  });
mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB connection closed!");
  });
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
  

export default ConnectToDatabase;