import { IUser, User } from "../models/Auth.user";

export default class UserViewModel {
    static async deleteUserById(id : string):Promise<IUser | null>{
        return  await User.findByIdAndUpdate({id , isDeleted : true})
    }

    public static async finOneAndUpdate(NewrefershToken : string , oldRefershToken : string):Promise<string| void >{
         await User.findOneAndUpdate(
            {refreshToken: oldRefershToken}, // Find conditl̥ion
            { $set: { refreshToken: NewrefershToken} }, // Update operation
  
         )
    }

    public static async updateCreateRefToken(refershToken: string):Promise<string| void >{
        console.log("Updating RefershToken to Db",refershToken)
        await User.updateOne(
            {refreshToken :refershToken}
        )
   }



    //this route not for all only accessble to admin  make it rock solid
    public static async getAllUsers():Promise<IUser[]>{
        return await User.find()
    }

    public static async getSavedRefershToken(refershToken : string):Promise<string|null>{
        return await User.findOne({refreshToken : refershToken})
   }

    public static async getUserByCountry(country : string):Promise<IUser[]>{
        return await User.find({country : country})
    }

    public static async getUserByEmail(email : string):Promise<IUser | null>{
        return await User.findOne({email : email})
    }

    public static async getUserByEmailOrPhone(email : string , phone : string) :Promise<IUser |  null >{
        return await User.findOne({
            $or: [{ email }, { phone}]
        });
    }

    public static async getUserById(id : string):Promise<IUser | null>{
        return await User.findById(id)
    }

    public static async getUserByPhone(phone : string):Promise<IUser | null>{
        return await User.findOne({phone : phone })
    }

    //this route not for all only accessble to admin  make it rock solid
    public static async getUserByRole(role : string):Promise<IUser[]>{
        return await User.find({role : role})
    }

   //create login route
   //not completed yet
    public static async loginUser(email : string , password : string):Promise<IUser | null>{
        const user = await User
        .findOne({email : email})   
        if(!user){
            return null
        }
        return user
    }

    public static async registerUser(user : Partial<IUser> ):Promise<IUser>{
      return await User.create(user);
    }

    public static async updateUserById(id : string , user : Partial<IUser>):Promise<IUser | null>{
        return await User.findByIdAndUpdate
        (id , user , {new : true})
    }
}
