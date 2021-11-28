import { useState } from 'react'
import {Form, Button, Message, Container} from 'semantic-ui-react'
import Header from './../components/header'
export default function AddService(){
    const [servico, setServico] = useState("")
    const [valor, setValor] = useState("")
    const [dataServico, setData] = useState("")
    return (
        <div>
            <Header />
            <Container>
                <h1>Lance aqui o serviço feito</h1>
                <Form>
                    <Message/>
                    <Form.Field>
                        <label>Nome do serviço</label>
                        <input type={'text'} onChange={e=> setServico(e.target.value)} required></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Valor cobrado</label>
                        <input type={'text'} onChange={e=> setValor(e.target.value)} required></input>
                    </Form.Field>                 
                    <Form.Field>
                        <label>Data do serviço</label>
                        <input type={'date'} onChange={e=> setData(e.target.value)} required></input>
                    </Form.Field> 
                    <Button primary>Inserir</Button>
                </Form>
            </Container>
        </div>
    )
}