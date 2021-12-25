import {Table, Container, Button, Dimmer, Loader, Segment} from 'semantic-ui-react'
import Header from './../components/header'
import Moment from 'moment'
import { useEffect, useState } from 'react'
import {db} from './../firebase'
import dataTable from './../mocks/serviceMock'
import Service from './../model/service'
import {useRouter} from 'next/router'
import { collection, query, where, addDoc,onSnapshot, limit  } from "firebase/firestore";
import moment from 'moment'
import { useAuth } from '../components/contexts/authContext'

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
    const router = useRouter()
    const dateFormat = 'DD/MM/YYYY'
    function mockdata(){
        dataTable.map(async ({client,date,price,service}) => {
            const docRef = await addDoc(collection(db, "service"), {
                uid: 'MrZU4lQSyZZEZG7MfL3QKRyHsyj2',
                service: service,
                name: client,
                price: price,
                serviceDate: date
              });
              console.log(docRef.id)
        })
        
    }
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
                    service: docService.service,
                    client: docService.name,
                    price: docService.price,
                    date: moment(docService.serviceDate).format(dateFormat)
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
    },[router.query.uid, uid])
    return(
        <div>
            <Header/>
            <Container>
                <Segment basic>
                 <Dimmer active={isLoadingData} inverted>
                     <Loader inverted/>
                </Dimmer>   
                <h2>Serviços realizados</h2>
                <Button loading={isFilterLoad7} onClick={() =>filter(7)}  basic={isFilter7} color='pink'>7 dias</Button>
                <Button loading={isFilterLoad15} onClick={() =>filter(15)} basic={isFilter15}  color='pink'>15 dias</Button>
                <Button loading={isFilterLoad30} onClick={() =>filter(30)} basic={isFilter30}  color='pink'>30 dias</Button>
                {/* <Button onClick={() =>mockdata()} basic={isFilter30}  color='pink'>Generate Mock</Button> */}
                <Table size='large' color='pink' unstackable selectable> 
                    <Table.Header>
                        <Table.HeaderCell>Serviço</Table.HeaderCell>
                        <Table.HeaderCell>Cliente</Table.HeaderCell>
                        <Table.HeaderCell>Valor</Table.HeaderCell>
                        <Table.HeaderCell>Data do Serviço</Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>

                        {currentList.map(({ service, client, price, date },x) => (
                        <Table.Row key={x}>
                            <Table.Cell>{service}</Table.Cell>
                            <Table.Cell>{client}</Table.Cell>
                            <Table.Cell>{priceFormat(price,currentCurrency)}</Table.Cell>
                            <Table.Cell>{date}</Table.Cell>
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
            <br/>
        </div>
    )
}