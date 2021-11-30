import {Table, Container, Button} from 'semantic-ui-react'
import Header from './../components/header'
import Moment from 'moment'
import { useState } from 'react'
export default function ServiceList(){
    type service = {
            service:string,
            client:string,
            price:string,
            date:Date
    }
    const currentCurrency = 'br'
    const [currentList, setList] = useState([])
    const [isFilter7, setFilter7] = useState(true)
    const [isFilter15, setFilter15] = useState(true)
    const [isFilter30, setFilter30] = useState(true)
    const [rentability, setRent] = useState(0)
    const [profit, setProfit] = useState(0)
    const dataTable = [
        {
            id: 1,
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 40.90,
            date: '2021-11-29'
        },
        {
            id: 2,
            service: 'Depilação',
            client: 'Maria',
            price: 80.00,
            date: '2021-11-28'
        },
        {
            id: 3,
            service: 'Manicure pé',
            client: 'Maria',
            price: 40.00,
            date: '2021-11-27'
        },
        {
            id: 4,
            service: 'Alongamento',
            client: 'Maria',
            price: 120.00,
            date: '2021-11-15'
        },
        {
            id: 5,
            service: 'Manicure pé e mão',
            client: 'Marcia',
            price: 40.00,
            date: '2021-11-20'
        },
        {
            id: 6,
            service: 'Manicure pé e mão',
            client: 'Mara',
            price: 40.00,
            date: '2021-11-07'
        },
        {
            id: 7,
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 40.00,
            date: '2021-11-06'
        },
        {
            id: 8,
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 40.00,
            date: '2021-11-05'
        },
        {
            id: 9,
            service: 'Manicure pé e mão',
            client: 'Marta',
            price: 40.50,
            date: '2021-11-04'
        },
        {
            id: 10,
            service: 'Manicure pé e mão',
            client: 'Ana',
            price: 40.00,
            date: '2021-11-03'
        },
        {
            id: 11,
            service: 'Manicure pé e mão',
            client: 'Claudia',
            price: 40.00,
            date: '2021-11-02'
        },
        {
            id: 12,
            service: 'Manicure pé e mão',
            client: 'Rose',
            price: 40.00,
            date: '2021-11-01'
        },
    ]
    async function filter(days:number){
        let arrayList = []
        let rent = 0
        await dataTable.map((service)=>{
            const getnow = Moment()
            const serviceDate = Moment(service.date)
            const diff = getnow.diff(serviceDate, 'days')+ '   '+ serviceDate.format('DD/MM/YYYY')
            if(parseInt(diff) <= days){
                arrayList.push(service)
                rent+=service.price
            }
        })
        setList(arrayList)
        setRent(rent)
        setProfit(rent/2)
        setFilter7(true)
        setFilter15(true)
        setFilter30(true)
        if(days === 7){
            setFilter7(false)
        }else if(days === 15 ){
            setFilter15(false)
        }else if(days === 30){
            setFilter30(false)
        }
        
    }
    function priceFormat(price:number, currency:string):string{
        switch(currency){
            case 'br': return 'R$ '+ price.toString().replace('.',',')
        }
    }
    return(
        <div>
            <Header/>
            <Container>
                <h2>Serviços realizados</h2>
                <Button onClick={() =>filter(7)}  basic={isFilter7} color='pink'>7 dias</Button>
                <Button onClick={() =>filter(15)} basic={isFilter15}  color='pink'>15 dias</Button>
                <Button onClick={() =>filter(30)} basic={isFilter30}  color='pink'>30 dias</Button>
            <Table size='large' color='pink' unstackable selectable> 
                <Table.Header>
                    <Table.HeaderCell>Serviço</Table.HeaderCell>
                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                    <Table.HeaderCell>Valor</Table.HeaderCell>
                    <Table.HeaderCell>Data do Serviço</Table.HeaderCell>
                </Table.Header>
                <Table.Body>

                    {currentList.map(({ id,service, client, price, date }) => (
                    <Table.Row key={id}>
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