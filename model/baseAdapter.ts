import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import {db} from './../firebase'
export default class BaseAdapter {

    async insert(object:any, collectionName:string){
        try{
            const docRef = await addDoc(collection(db, collectionName), object);
            return {message: docRef.id}
        }catch(e){
            return {message: e}
        }
        
    }

    async update(object:any, id:string,collectionName:string, converter: any){
        try{
            const userRef = doc(db, collectionName, id).withConverter(converter);
            await setDoc(userRef, object);
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