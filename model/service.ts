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
        recived?: Date
}

export default class Service extends BaseAdapter implements IService{
    
    static COLLECTION_NAME:string = 'service'
    public recived?: Date
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
                    recived: service.recived
                    };
            },
            fromFirestore: (snapshot, options) => {
                const data = snapshot.data(options);
                return new Service(data.uid,data.service,data.name,data.price,data.serviceDate, data.recived);
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
            recived: this.recived,
            timestamp: serverTimestamp()
          }
        return this.insert(newService, Service.COLLECTION_NAME)
    }

    updateService(id:string):Promise<{message}>{
        const service = new Service(id,this.uid,this.name,this.service,this.price,this.serviceDate)
        service.recived = this.recived
        return this.update(
            service,
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
                serviceDate: moment.unix(docService.serviceDate.seconds).toDate(),
                recived: moment.unix(docService.recived.seconds).toDate()
            });
        });
        return services
    }


    
}

