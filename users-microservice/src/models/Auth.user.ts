import bycrpt from 'bcrypt';
import mongoose, {Document, Schema} from "mongoose";


// User Roles
export type UserRole = "buyer" | "seller" | "admin";


export interface IAddress extends Document {
    title : string,   //some may save one or more address like home, office etc
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
} 


// Address Schema
const AddressSchema = new Schema<IAddress>({
  title : {type : String , required : true},  
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
});



export interface IUser extends Document{
    _id: string;
    name : string,
    email : string ,
    password: string,
    phone : string,
    profileImage : string,
    country : string,
    role : UserRole,
    refreshToken : string , 
    address : IAddress,
    orderHistory :[mongoose.Types.ObjectId],
    favoriteProducts : [mongoose.Types.ObjectId],
    kart : [mongoose.Types.ObjectId],
    reviews : [mongoose.Types.ObjectId],
    isDeleted : boolean,
    isValidPassword(password: string): Promise<boolean>;
}

// Main User Schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false, unique: true,sparse : true },
    profileImage: { type: String, default: null },
    country: { type: String, required: false , default : "india" },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
    refreshToken : {type : String, default : " " },
    address: [AddressSchema],
    // Buyer Fields
    orderHistory: [{ type: Schema.Types.ObjectId}],
    // Soft Delete
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }

);


UserSchema.pre<IUser>('save' , async function (next){
    console.log("Some Connection is Comming.....")
   try{

    if(!this.isModified('password')) {return next()}

     //convert the blank password hashed password
    
     const salt = await bycrpt.genSalt(10)

     this.password = await bycrpt.hash(this.password, salt)
     next()
    
   }catch(error : any){
    next(error)
   }
    
});


UserSchema.methods.isValidPassword = async function (password : string):Promise<boolean> {
   return await bycrpt.compare(password , this.password);
}


export const User = mongoose.model<IUser>("User", UserSchema);


