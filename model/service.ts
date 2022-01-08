import { orderBy, serverTimestamp, where  } from "firebase/firestore";
import moment from "moment";
import BaseAdapter from "./baseAdapter";

interface IService{
        id?: string
        uid?: string,
        name?: string,
        service?:string,
        price?: number,
        serviceDate?: Date
}

export default class Service extends BaseAdapter implements IService{
    
    static COLLECTION_NAME:string = 'service'
    constructor(public id?: string , public uid?: string,
        public name?: string,
        public service?:string,
        public price?: number,
        public serviceDate?: Date){
        super();
    }

    converter(){
        return  {
            toFirestore: (service) => {
                return {
                    uid: service.uid,
                    service: service.service,
                    name: service.name,
                    price: service.price,
                    serviceDate: service.serviceDate,
                    };
            },
            fromFirestore: (snapshot, options) => {
                const data = snapshot.data(options);
                return new Service(data.uid,data.service,data.name,data.price,data.serviceDate);
            }
        };
    }

    async insertService():Promise<{}>{
        const newService = {
            uid: this.uid,
            service: this.service,
            name: this.name,
            price: this.price,
            serviceDate: new Date(this.serviceDate),
            timestamp: serverTimestamp()
          }
        return this.insert(newService, Service.COLLECTION_NAME)
    }

    updateService(id:string):Promise<{message}>{
        return this.update(
            new Service(id,this.uid,this.name,this.service,this.price,this.serviceDate),
            id,
            Service.COLLECTION_NAME,
            this.converter()) 
    }

    deleteService():Promise<{message}>{
        return this.delete(this.id, Service.COLLECTION_NAME)
    }

    async getDocumentByDate(dateFilterInitial:string, dateFilterFinal:string, uid:string){
        let services = []
        let query = await this.getDocuments(Service.COLLECTION_NAME, [where("serviceDate", ">=", moment(dateFilterInitial).toDate()), where("serviceDate", "<=", moment(dateFilterFinal).toDate()),where("uid", "==", uid), orderBy("serviceDate","desc")])
        query.forEach((doc) => {
            const docService = doc.data()
            services.push({
                id: docService.id,
                service: docService.service,
                client: docService.name,
                price: docService.price,
                date: moment.unix(docService.serviceDate.seconds).toDate()
            });
        });
        return services
    }


    
}

