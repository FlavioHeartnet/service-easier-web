import {Table, Container, Button} from 'semantic-ui-react'
import Header from './../components/header'
import Moment from 'moment'
import { useEffect, useState } from 'react'
import {db} from './../firebase'
import dataTable from './../mocks/serviceMock'
import Service from './../model/service'
import {useRouter} from 'next/router'
import { collection, query, where, getDocs, addDoc,onSnapshot  } from "firebase/firestore";
import moment from 'moment'

export default function ServiceList(){
  
    
    const currentCurrency = 'br'
    let firebaseServiceList = []
    const [currentList, setList] = useState([])
    const [isFilter7, setFilter7] = useState(true)
    const [isFilter15, setFilter15] = useState(true)
    const [isFilter30, setFilter30] = useState(true)
    const [isFilterLoad7, setFilterLoad7] = useState(false)
    const [isFilterLoad15, setFilterLoad15] = useState(false)
    const [isFilterLoad30, setFilterLoad30] = useState(false)
    const [rentability, setRent] = useState(0)
    const [profit, setProfit] = useState(0)
    const router = useRouter()
    const uid = router.query.uid
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
            const serviceDate = Moment(docService.date)
            const diff = getnow.diff(serviceDate, 'days')+ '   '+ serviceDate.format('DD/MM/YYYY')
            if(parseInt(diff) <= days){
                serviceList.push({
                    service: docService.service,
                    client: docService.name,
                    price: docService.price,
                    date: moment(docService.serviceDate).format('DD/MM/YYYY')
                })
                rent+= docService.price;     
            }
        })
            
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

    
    async function getAllServicesByUid(){
        console.log(uid)
        const serviceList = []
        const q = query(collection(db, Service.COLLECTION_NAME), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const docService = doc.data()
            serviceList.push({
                service: docService.service,
                client: docService.name,
                price: docService.price,
                date: moment(docService.serviceDate).format('DD/MM/YYYY')
            })
        });
        
        firebaseServiceList = serviceList
        console.log(firebaseServiceList)
    }
    useEffect(() => {
         getAllServicesByUid()
    })
    
    async function SnapshotRealTimeListener(){
        const services = [];
        const q = query(collection(db, Service.COLLECTION_NAME), where("uid", "==", uid));
        const unsub =  await onSnapshot(q, (querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
                const docService = doc.data()
                services.push({
                    service: docService.service,
                    client: docService.name,
                    price: docService.price,
                    date: moment.unix(docService.serviceDate).format('DD/MM/YYY')
                });
            });
            console.log("Services ", services.join(", "));
        });
        setList(services)
        return unsub
    }
   //SnapshotRealTimeListener()
    return(
        <div>
            <Header/>
            <Container>
                <h2>Serviços realizados</h2>
                <Button loading={isFilterLoad7} onClick={() =>filter(7)}  basic={isFilter7} color='pink'>7 dias</Button>
                <Button loading={isFilterLoad15} onClick={() =>filter(15)} basic={isFilter15}  color='pink'>15 dias</Button>
                <Button loading={isFilterLoad30} onClick={() =>filter(30)} basic={isFilter30}  color='pink'>30 dias</Button>
                <Button onClick={() =>mockdata()} basic={isFilter30}  color='pink'>Generate Mock</Button>
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
            </Container>
            <br/>
        </div>
    )
}