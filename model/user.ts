import { collection,addDoc } from "firebase/firestore";
import {db} from './../firebase'

interface IUser {
    id:string
    uid:string
    name:string
    email: string
    cpf:string
    phone:string
}

export default class User implements IUser {
    id: string;
    uid: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    static COLLECTION_NAME:string = 'user'
    constructor(uid,name,email,cpf,phone){
        this.uid = uid
        this.name = name
        this.email = email
        this.cpf = cpf
        this.phone = phone
    }
    


async insertUser():Promise<string>{
        const docRef = await addDoc(collection(db, User.COLLECTION_NAME), {
            uid: this.uid,
            email: this.email,
            name: this.name,
            cpf: this.cpf,
            phone: this.phone
          });
          if(docRef.id !== ''){
              return 'error'
          }else{
              return docRef.id
          }
    }

   async updateUser(uid:string) {
       
   }


}