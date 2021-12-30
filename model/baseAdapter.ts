import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {db} from './../firebase'
export default class BaseAdapter {

    async insert(object:any, collectionName:string){
        const docRef = await addDoc(collection(db, collectionName), object);
          if(docRef.id !== ''){
              return {message: 'error'}
          }else{
              return {message: docRef.id}
          }
    }

    async update(object:any, id:string,collectionName:string, converter: any){
        try{
            const userRef = doc(db, collectionName, id).withConverter(converter);
            await updateDoc(userRef, object);
            return {message: "success"}
        }catch(e){
            return {message:e}
        }
    }

    async delete(id:string, collectionName:string){
        try{
            await deleteDoc(doc(db, collectionName, id));
            return {message: 'success'}
        }catch(e){
            return {message: e}
        }
        
    }
}