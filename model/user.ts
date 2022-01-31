import { updateEmail, updateProfile } from "firebase/auth";
import { collection, query, serverTimestamp, where  } from "firebase/firestore";
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
    static CPF_ERROR_MESSAGE:string = 'CPF já cadastrado, por favor insira outro para finalizar o cadastro! ;)'
    constructor(uid?,cpf?,phone?, comission?, payday?, timestamp?){
        super();
        this.uid = uid
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
                    cpf: user.cpf,
                    phone: user.phone,
                    comission: user.comission,
                    payday: user.payday,
                    timestamp: user.timestamp
                    };
            },
            fromFirestore: (snapshot, options) => {
                const data = snapshot.data(options);
                return new User(data.uid,data.cpf,data.phone, data.comission,data.payday,data.timestamp);
            }
        };
    }

async checkData(){
  const snapshot = await this.getDocuments(User.COLLECTION_NAME, [where("cpf", "==", this.cpf)])
  console.log(snapshot.empty)
  return snapshot.empty
}
async insertUser():Promise<{message}>{
        
        if(this.checkData()){
          const newUser = {
            uid: this.uid,
            cpf: this.cpf,
            phone: this.phone,
            comission: 50,
            payday: 15,
            timestamp: serverTimestamp()
          }
          return this.insert(newUser,User.COLLECTION_NAME)
        }else{
          return {message: User.CPF_ERROR_MESSAGE}
        }
        
    }

   async updateUser(id:string):Promise<{message}> {
    if(this.checkData()){
    return this.update(
        new User(this.uid,this.cpf,this.phone, this.comission, this.payday, serverTimestamp()),
        id,
        User.COLLECTION_NAME,
        this.converter()) 
    }else{
      return {message: User.CPF_ERROR_MESSAGE}
    }
   }

   async updateEmailInFirebase(auth, email){
    await updateEmail(auth.currentUser, email).then(() => {
        return ({message: 'sucess'})
      }).catch((error) => {
        return(error)
      });
   }

   async updateDisplayNameInFireBase(auth, name){
    await updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        return 'sucess'
      }).catch((error) => {
        return error
      });
   }

   async getUserbyUid(uid:string){
      const snapshot = await this.getDocuments(User.COLLECTION_NAME, [where("uid", "==", uid)])
      type UserType = {
        id:string
        uid:string
        cpf:string
        phone:string
        comission:number
        payday:number
      }
      let currentuser:UserType = {
        id: "",
        uid: "",
        cpf: "",
        phone: "",
        comission: 0,
        payday: 0
      }
      snapshot.forEach(item => {
        const data = item.data()
        currentuser = {
          id: item.id,
          uid: data.uid,
          cpf: data.cpf,
          phone: data.phone,
          comission: data.comission,
          payday: data.payday
        }
      })
      return currentuser
   }


}