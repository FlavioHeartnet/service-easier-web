import {Table, Container, Button, Dimmer, Loader, Segment, Icon} from 'semantic-ui-react'
import Header from './../components/header'
import Moment from 'moment'
import { useEffect, useState } from 'react'
import {db} from './../firebase'
import Service from './../model/service'
import { collection, query, where, addDoc,onSnapshot, limit  } from "firebase/firestore";
import moment from 'moment'
import { useAuth } from '../components/contexts/authContext'
import CustomModalDelete from '../components/customModalDelete'
import CustomModalUpdate from '../components/customModalUpdate'
export default function ServiceList(){
  
    const {uid} = useAuth()
    const currentCurrency = 'br'
    const [firebaseServiceList, setFirebaseServiceList] = useState([new Service()])
    const [currentList, setList] = useState([])
    const [isFilter7, setFilter7] = useState(true)
    const [isFilter15, setFilter15] = useState(true)
    const [isFilter30, setFilter30] = useState(true)
    const [isFilterLoad7, setFilterLoad7] = useState(false)
    const [isFilterLoad15, setFilterLoad15] = useState(false)
    const [isFilterLoad30, setFilterLoad30] = useState(false)
    const [rentability, setRent] = useState(0)
    const [profit, setProfit] = useState(0)
    const [isLoadingData, setLoadingData] = useState(false)
    const dateFormat = 'DD/MM/YYYY'
    async function filter(days:number){ 
        let rent = 0
        const serviceList = []
        setFilter7(true)
        setFilter15(true)
        setFilter30(true)
        
        firebaseServiceList.map((docService)=>{  
            
            const getnow = Moment()
            const serviceDate = Moment(docService.serviceDate)
            const diff = getnow.diff(serviceDate, 'days')
            if(diff <= days){
                serviceList.push({
                    id: docService.id,
                    service: docService.service,
                    client: docService.name,
                    price: docService.price,
                    date: docService.serviceDate
                })    
            }
        })
            
            rent = Math.round(serviceList.reduce((acc,c) => acc + parseFloat(c.price), 0))
            setList(serviceList)
            setRent(rent)
            setProfit(rent/2)
        if(days === 7){
            setFilter7(false)
            setFilterLoad7(true)
        }else if(days === 15 ){
            setFilter15(false)
            setFilterLoad15(true)
        }else if(days === 30){
            setFilter30(false)
            setFilterLoad30(true)
        }
        setFilterLoad7(false)
        setFilterLoad15(false)
        setFilterLoad30(false)
        
    }

    function reloadListbyFilter(){
        let numberofdays = 7
        if(!isFilter15){
            numberofdays = 15
        }else if(!isFilter30){
            numberofdays = 30
        }
        filter(numberofdays)
    }
    function priceFormat(price:number, currency:string):string{
        switch(currency){
            case 'br': return 'R$ '+ price.toString().replace('.',',')
        }
    }
    
    useEffect(() => {
        let services: Service[] = []
        setLoadingData(true)
        try{
            console.log(uid)
            if(uid!= undefined && uid!= null){
                const q = query(collection(db, Service.COLLECTION_NAME), where("uid", "==", uid),limit(250));
                const unsub = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        setLoadingData(false) 
                        if (change.type === "added") {
                           console.log("Service Added: ", change.doc.data());
                            const docService = change.doc.data()
                            services.push(new Service(
                                change.doc.id, uid.toString(),
                                docService.name,
                                docService.service,
                                docService.price,
                                docService.serviceDate
                            ));
                            
                            
                        }
                        if (change.type === "modified") {
                            console.log("service Modified: ", change.doc.data());
                            
                            const docService = change.doc.data()
                            const modifyService = new Service(
                                 change.doc.id, uid.toString(),
                                 docService.name,
                                 docService.service,
                                 docService.price,
                                 docService.serviceDate
                             );
                             let serviceItemToModify = services.filter((a)=> a.id === modifyService.id)
                             services[services.indexOf(serviceItemToModify[0])] = modifyService
                             console.log(services)
                             
                        }
                        if (change.type === "removed") {
                            console.log("Service Removed: ", change.doc.data());
                            let serviceItemToRemove = services.filter((a)=> a.id === change.doc.id)
                            services.splice(services.indexOf(serviceItemToRemove[0]),1)
                            console.log(services)
                        }
                        });
                        setFirebaseServiceList(services)
                });
                
                }
            
        }catch(e){
            console.log(e)
        }
    },[uid])

   async function deleteService(id:string){
        const service = new Service(id)
        const resp = await service.deleteService()
        if(resp.message == 'success'){
            reloadListbyFilter()
        }
    }
    async function updateService(id, name,service,price,date){
        const resp = await new Service(id,uid, name,service,price,date).updateService(id)
        if(resp.message == 'success'){
            reloadListbyFilter()
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
                <h2>Serviços realizados</h2>
                <Button loading={isFilterLoad7} onClick={() =>filter(7)}  basic={isFilter7} color='pink'>7 dias</Button>
                <Button loading={isFilterLoad15} onClick={() =>filter(15)} basic={isFilter15}  color='pink'>15 dias</Button>
                <Button loading={isFilterLoad30} onClick={() =>filter(30)} basic={isFilter30}  color='pink'>30 dias</Button>
                <Table size='large' color='pink' unstackable selectable> 
                    <Table.Header>
                        <Table.HeaderCell>Serviço</Table.HeaderCell>
                        <Table.HeaderCell>Cliente</Table.HeaderCell>
                        <Table.HeaderCell>Valor</Table.HeaderCell>
                        <Table.HeaderCell>Data do Serviço</Table.HeaderCell>
                        <Table.HeaderCell>Ações</Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>

                        {currentList.map(({ id,service, client, price, date },x) => (
                        <Table.Row key={x}>
                            <Table.Cell>{service}</Table.Cell>
                            <Table.Cell>{client}</Table.Cell>
                            <Table.Cell>{priceFormat(price,currentCurrency)}</Table.Cell>
                            <Table.Cell>{moment(date).format(dateFormat)}</Table.Cell>
                            <Table.Cell><CustomModalUpdate {...{ id,client, service, price, date }} updateService={updateService}/> <CustomModalDelete id={id} deleteService={deleteService}/></Table.Cell>
                        </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <Table>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Faturamento neste periodo</Table.Cell>
                            <Table.Cell warning>{priceFormat(rentability, currentCurrency)}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Comissão neste periodo</Table.Cell>
                            <Table.Cell positive><b>{priceFormat(profit, currentCurrency)}</b></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                </Segment>
              
            </Container>
            </Header>
            
            <br/>
        </div>
    )
}