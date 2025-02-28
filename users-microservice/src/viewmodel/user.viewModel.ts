import UserController from "../controller/UserController";
import { IUser, User} from "../models/Auth.user";



export default class UserViewModel {
    static async  registerUser(user : Partial<IUser> ):Promise<IUser>{
      return await User.create(user);
    }

    static async getUserByEmail(email : string):Promise<IUser | null>{
        return await User.findOne({email : email})
    }   

    static async getUserById(id : string):Promise<IUser | null>{
        return await User.findById(id)
    }
    static async updateUserById(id : string , user : Partial<IUser>):Promise<IUser | null>{
        return await User.findByIdAndUpdate
        (id , user , {new : true})
    }
    static async deleteUserById(id : string):Promise<IUser | null>{
        return  await User.findByIdAndUpdate({id , isDeleted : true})
    }

    //this route not for all only accessble to admin  make it rock solid
    static async getAllUsers():Promise<IUser[]>{
        return await User.find()
    }
    static async getUserByPhone(phone : string):Promise<IUser | null>{
        return await User.findOne({phone : phone })
    }

    //this route not for all only accessble to admin  make it rock solid
    static async getUserByRole(role : string):Promise<IUser[]>{
        return await User.find({role : role})
    }

    static async getUserByCountry(country : string):Promise<IUser[]>{
        return await User.find({country : country})
    }

   //create login route
   //not completed yet
    static async loginUser(email : string , password : string):Promise<IUser | null>{
        const user = await User
        .findOne({email : email})   
        if(!user){
            return null
        }
        return user

    }
        
}