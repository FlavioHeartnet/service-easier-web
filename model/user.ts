import { serverTimestamp  } from "firebase/firestore";
import BaseAdapter from "./baseAdapter";

interface IUser {
    id:string
    uid:string
    name:string
    email: string
    cpf:string
    phone:string
    comission:number
    payday:number
}

export default class User extends BaseAdapter implements IUser  {
    id: string;
    uid: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    comission: number;
    payday: number;
    timestamp:Date
    static COLLECTION_NAME:string = 'user'
    constructor(uid,name,email,cpf,phone, comission, payday, timestamp){
        super();
        this.uid = uid
        this.name = name
        this.email = email
        this.cpf = cpf
        this.phone = phone
        this.comission = comission
        this.payday = payday
        this.timestamp = timestamp
    }
    
    converter(){
        return  {
            toFirestore: (user) => {
                return {
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                    cpf: user.cpf,
                    phone: user.phone,
                    comission: user.comission,
                    payday: user.payday,
                    timestamp: user.timestamp
                    };
            },
            fromFirestore: (snapshot, options) => {
                const data = snapshot.data(options);
                return new User(data.uid,data.name,data.email,data.cpf,data.phone, data.comission,data.payday,data.timestamp);
            }
        };
    }


async insertUser():Promise<{message}>{
        const newUser = {
            uid: this.uid,
            email: this.email,
            name: this.name,
            cpf: this.cpf,
            phone: this.phone,
            comission: 50,
            payday: 15,
            timestamp: serverTimestamp()
          }
       return this.insert(newUser,User.COLLECTION_NAME)
    }

   async updateUser(id:string):Promise<{message}> {
    return this.update(
        new User(this.uid,this.name,this.email,this.cpf,this.phone, this.comission, this.payday, serverTimestamp()),
        id,
        User.COLLECTION_NAME,
        this.converter()) 
   }


}