import {Table, Container, Button, Dimmer, Loader, Segment, Dropdown, Input} from 'semantic-ui-react'
import Header from './../components/header'
import Moment from 'moment'
import { useEffect, useState } from 'react'
import {db} from './../firebase'
import Service from './../model/service'
import { collection, query, where,onSnapshot, limit, getDocs, orderBy } from "firebase/firestore";
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
    const [isFilterOpen, setisFilterOpen] = useState(false)
    const [dateFilterInitial, setdateFilterInitial] = useState("")
    const [dateFilterFinal, setdateFilterFinal] = useState("")
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
        serviceList.sort((a,b) => {
            return +moment(b.date).toDate() - +moment(a.date).toDate()
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
            if(uid!= undefined && uid!= null){
                const q = query(collection(db, Service.COLLECTION_NAME), where("uid", "==", uid),orderBy("serviceDate", "desc"),limit(250));
                const unsub = onSnapshot(q, (querySnapshot) => {
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
    async function searchServices(){
        setisFilterOpen(!isFilterOpen)
        const q = query(collection(db, Service.COLLECTION_NAME), where("serviceDate", ">=", moment(dateFilterInitial).toDate()), where("serviceDate", "<=", moment(dateFilterFinal).toDate()), orderBy("serviceDate","desc"));
        const querySnapshot = await getDocs(q);
        const services = []
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            const docService = doc.data()
            services.push({
                id: docService.id,
                service: docService.service,
                client: docService.name,
                price: docService.price,
                date: moment.unix(docService.serviceDate.seconds).toDate()
            });
        });
        setList(services)
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
                <Button loading={isFilterLoad30} onClick={() =>filter(30)} basic={isFilter30}  color='pink'>30 dias</Button><p></p>
                <Dropdown onOpen={()=> setisFilterOpen(!isFilterOpen)} open={isFilterOpen} text='Busca personalizada' icon='filter' floating button>
                    <Dropdown.Menu >
                        <Dropdown.Item>
                            <Input action={{
                                color: 'pink',
                                labelPosition: 'left',
                                icon: 'filter',
                                content: 'Data incial',
                                }} actionPosition='left' onChange={(e)=> setdateFilterInitial(e.target.value)} placeholder='Data inicial' type='date'/>
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item><Input action={{
                            color: 'pink',
                            labelPosition: 'left',
                            icon: 'filter',
                            content: 'Data final',
                            }} actionPosition='left' onChange={(e)=> setdateFilterFinal(e.target.value)} placeholder='Data final' type='date'/></Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item><Button onClick={()=> searchServices()} fluid color='pink'>Buscar</Button></Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
                <Table size='large' color='pink' stackable selectable> 
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