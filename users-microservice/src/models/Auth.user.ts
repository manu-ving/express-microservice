import bycrpt from 'bcrypt'
import mongoose, {Schema , Document} from "mongoose";



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
    name : string,
    email : string ,
    password: string,
    phone : string,
    profileImage : string,
    country : string,
    role : UserRole,
    address : IAddress,
    orderHistory :[mongoose.Types.ObjectId],
    favoriteProducts : [mongoose.Types.ObjectId],
    kart : [mongoose.Types.ObjectId],
    reviews : [mongoose.Types.ObjectId],
    isDeleted : boolean
}

// Main User Schema
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    profileImage: { type: String, default: null },
    country: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
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

     //convert the blank password hased password
    
     const salt = await bycrpt.genSalt(10)

     const hasedPassword  : string = await bycrpt.hash(this.password,salt)
     this.password = hasedPassword
     next()
    
   }catch(error : any){
    next(error)
   }
    
});



export const User = mongoose.model<IUser>("User", UserSchema);


