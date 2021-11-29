import {Table, Container, Button} from 'semantic-ui-react'
import Header from './../components/header'
export default function ServiceList(){
    const dataTable = [
        {
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 'R$ 40,00',
            date: '12/11/2021 as 14h'
        },
        {
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 'R$ 40,00',
            date: '12/11/2021 as 14h'
        },
        {
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 'R$ 40,00',
            date: '12/11/2021 as 14h'
        },
        {
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 'R$ 40,00',
            date: '12/11/2021 as 14h'
        },
        {
            service: 'Manicure pé e mão',
            client: 'Maria',
            price: 'R$ 40,00',
            date: '12/11/2021 as 14h'
        }
    ]
    return(
        <div>
            <Header/>
            <Container>
                <h2>Serviços realizados</h2>
                <Button color='pink'>7 dias</Button>
                <Button basic color='pink'>15 dias</Button>
                <Button basic color='pink'>30 dias</Button>
            <Table size='large' color='pink' unstackable selectable> 
                <Table.Header>
                    <Table.HeaderCell>Serviço</Table.HeaderCell>
                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                    <Table.HeaderCell>Valor</Table.HeaderCell>
                    <Table.HeaderCell>Data do Serviço</Table.HeaderCell>
                </Table.Header>
                <Table.Body>

                    {dataTable.map(({ service, client, price, date }) => (
                    <Table.Row key={service}>
                        <Table.Cell>{service}</Table.Cell>
                        <Table.Cell>{client}</Table.Cell>
                        <Table.Cell>{price}</Table.Cell>
                        <Table.Cell>{date}</Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Faturamento neste periodo</Table.Cell>
                        <Table.Cell warning>R$ 250,00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Comissão neste periodo</Table.Cell>
                        <Table.Cell positive><b>R$ 150,00</b></Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            </Container>
            <br/>
        </div>
    )
}