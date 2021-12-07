import { collection, query, where, getDocs, addDoc,onSnapshot  } from "firebase/firestore";
import {db} from './../firebase'

interface IService{
        uid?: string,
        name?: string,
        service?:string,
        price?: number,
        serviceDate?: string
}

export default class Service implements IService{
    
    static COLLECTION_NAME:string = 'service'
    constructor(public uid?: string,
        public name?: string,
        public service?:string,
        public price?: number,
        public serviceDate?: string){}

  

    async insertService():Promise<string>{
        const docRef = await addDoc(collection(db, Service.COLLECTION_NAME), {
            uid: this.uid,
            service: this.service,
            name: this.name,
            price: this.price,
            serviceDate: this.serviceDate
          });
          if(docRef.id !== ''){
              return 'error'
          }else{
              return docRef.id
          }
    }

    
}

