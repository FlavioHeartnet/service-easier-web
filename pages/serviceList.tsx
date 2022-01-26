import { Container, Dimmer, Loader, Segment, Grid, Icon} from 'semantic-ui-react'
import Header from './../components/header'
import { useEffect, useState } from 'react'
import {db} from './../firebase'
import Service from './../model/service'
import { collection, query, where,onSnapshot, limit, orderBy } from "firebase/firestore";
import moment from 'moment'
import { useAuth } from '../components/contexts/authContext'
import CustomModalDelete from '../components/customModalDelete'
import CustomModalUpdate from '../components/customModalUpdate'
import { priceFormat } from '../Utils/validations'
import BillingResume from '../components/billingResume'
import FilterButtons from '../components/filterButtons'
export default function ServiceList(){
  
    const {uid, updateTitlePage, profit,rentability, serviceList, updateCurrentList, currentDayFilter} = useAuth()
    updateTitlePage("Serviços Realizados")
    const currentCurrency = 'br'
    const [firebaseServiceList, setFirebaseServiceList] = useState([new Service()])
    const [isLoadingData, setLoadingData] = useState(false)
    const dateFormat = 'DD/MM/YYYY'

    
    
    useEffect(() => {
        let services: Service[] = []
        setLoadingData(true)
        try{
            if(uid!= undefined && uid!= null){
                const q = query(collection(db, Service.COLLECTION_NAME), where("uid", "==", uid),orderBy("serviceDate", "desc"),limit(250));
                return onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        setLoadingData(false) 
                        if (change.type === "added") {
                            const docService = change.doc.data()
                            services.push(new Service(
                                change.doc.id, uid.toString(),
                                docService.name,
                                docService.service,
                                docService.price,
                                moment.unix(docService.serviceDate.seconds).toDate()
                            ));
                            
                            
                        }
                        if (change.type === "modified") {
                            
                            const docService = change.doc.data()
                            const modifyService = new Service(
                                 change.doc.id, uid.toString(),
                                 docService.name,
                                 docService.service,
                                 docService.price,
                                 moment.unix(docService.serviceDate.seconds).toDate()
                             );
                             let serviceItemToModify = services.filter((a)=> a.id === modifyService.id)
                             services[services.indexOf(serviceItemToModify[0])] = modifyService
                        
                             
                        }
                        if (change.type === "removed") {
                            let serviceItemToRemove = services.filter((a)=> a.id === change.doc.id)
                            services.splice(services.indexOf(serviceItemToRemove[0]),1)
                        }
                        });
                        setFirebaseServiceList(services)
                        updateCurrentList(currentDayFilter,services)
                });
                
                }
            
        }catch(e){
            console.log(e)
        }
    },[currentDayFilter, uid])

   async function deleteService(id:string){
        const service = new Service(id)
        const resp = await service.deleteService()
        if(resp.message == 'success'){
            updateCurrentList(currentDayFilter,firebaseServiceList)
        }
    }
    async function updateService(id, name,service,price,date){
        const resp = await new Service(id,uid, name,service,price,date).updateService(id)
        if(resp.message == 'success'){ 
            updateCurrentList(currentDayFilter,firebaseServiceList)
        }
    }
    return(
        <div>
            <Header>
            <Container>
                <Segment basic>
                 <Dimmer active={isLoadingData} inverted>
                     <Loader inverted/>
                </Dimmer>   
                <p/>
                <BillingResume profit={profit} currentCurrency={currentCurrency} rentability={rentability}/>
                <FilterButtons firebaseServiceList={firebaseServiceList} />
                {serviceList.map(({ id,service, name, price, serviceDate },x) => (
                <Segment vertical key={x}>
                    <Grid padded>
                    <Grid.Row columns={3}>
                        <Icon color='pink' circular inverted size='large' name='dollar sign'/>
                        <Grid.Column width={7}>
                            <span><b>{priceFormat(price,currentCurrency)}</b></span><br/>
                            <span style={{"color": "rgba(0,0,0,.4)"}}><b>{service}</b></span><br/>
                            <span style={{"color": "rgba(0,0,0,.4)"}}>{name}</span>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={'6'}>
                            <p><b>{moment(serviceDate).format(dateFormat)}</b></p>
                            <Grid.Row>
                                <CustomModalUpdate {...{ id,name, service, price, serviceDate }} updateService={updateService}/>
                                <CustomModalDelete id={id} deleteService={deleteService}/>  
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row> 
                    </Grid>
                </Segment>
                ))}
                <br/><br/><br/><br/><br/>
                </Segment>
              
            </Container>
            </Header>
            
            <br/>
        </div>
    )
}