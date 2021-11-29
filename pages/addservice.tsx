import { useState } from 'react'
import {Form, Button, Message, Container} from 'semantic-ui-react'
import Header from './../components/header'
export default function AddService(){
    const [isLoading, setLoading] = useState(false)
    const [servico, setServico] = useState("")
    const [nome, setNome] = useState("")
    const [valor, setValor] = useState("")
    const [dataServico, setData] = useState("")
    const [isFormSucess, setFormSucess] = useState({})
    const [formMessage, setFormMessage] = useState({
        success: true,
        error:false,
        header:'',
        content:''
    })

    function insertService(){

        setLoading(true)
        setFormSucess({
            error: true
        })
        setFormMessage({
            error: true,
            success:false,
            header: 'Não foi possivel logar :(',
            content: "errorMessage"
          })
    }
    return (
        <div>
            <Header />
            <Container>
                <h1>Lance aqui o serviço feito</h1>
                <Form {...isFormSucess} loading={isLoading} onSubmit={insertService}> 
                    <Message {...formMessage}/>
                    <Form.Field>
                        <label>Nome do serviço</label>
                        <input placeholder='Digite o nome do serviço realizado' type={'text'} onChange={e=> setServico(e.target.value)} required></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Nome do cliente</label>
                        <input placeholder='Digite o nome do cliente atendido' type={'text'} onChange={e=> setNome(e.target.value)} required></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Valor cobrado</label>
                        <input placeholder='Digite o valor cobrado' type={'text'} onChange={e=> setValor(e.target.value)} required></input>
                    </Form.Field>                 
                    <Form.Field>
                        <label>Data do serviço</label>
                        <input placeholder='Digite quando o serviçofoi realizado' type={'date'} onChange={e=> setData(e.target.value)} required></input>
                    </Form.Field> 
                    <Button color='pink'>Inserir</Button>
                </Form>
            </Container>
        </div>
    )
}