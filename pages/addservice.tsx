import { useState } from 'react'
import {Form, Button, Message, Container} from 'semantic-ui-react'
import Header from './../components/header'
import InputMask from 'react-input-mask'
import maskPriceBr from './../Utils/masks'
import Service from './../model/service'
import moment from 'moment'
import { useAuth } from '../components/contexts/authContext'

export default function AddService(){
    const [isLoading, setLoading] = useState(false)
    const [service, setService] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState('R$ 0,00')
    const [serviceDate, setDate] = useState("")
    const [isFormSucess, setFormSucess] = useState({})
    const [mask, setMask] = useState({})
    const [formMessage, setFormMessage] = useState({
        success: true,
        error:false,
        header:'',
        content:''
    })
    
     

    
    const {uid} = useAuth()
    function clearInputs(){
        setService('')
        setName('')
        setMask({value: ''})
        setDate('')
    }
    function validadeDate(date:string):boolean{
        const getNow = moment()
        const diff = getNow.diff(moment(date), 'days')
            if(diff >= 0){
                return true
            }else{
                return false
            }
    }
    async function insertService(){
        const priceFormated = price.replace('R$ ', '').replace(',','.')
        setPrice(priceFormated)
        console.log(parseFloat(priceFormated))
        setLoading(true)
        try{
        if(validadeDate(serviceDate)){
            const serviceObject = new Service("",uid, name, service, parseFloat(priceFormated),serviceDate)
            await serviceObject.insertService()
            clearInputs()
            setLoading(false)
            setFormSucess({
                success: true
            })
            setFormMessage({
                error: false,
                success:true,
                header: 'Serviço inserido com sucesso :)',
                content: "Já esta cadastrado e contabilizado muito bem!!!"
            })
            
        }else{
            setLoading(false)
            setFormSucess({
                error: true
            })
            setFormMessage({
                error: true,
                success:false,
                header: 'Não foi possivel inserir o serviço :(',
                content: "A data do serviço esta no futuro, cadastre a data de hoje ou de dias anteriores"
            })
        }
        }catch(error){
            console.log(error)
            setLoading(false)
            setFormSucess({
                error: true
            })
            setFormMessage({
                error: true,
                success:false,
                header: 'Não foi possivel inserir o serviço :(',
                content: "Serviço indisponivel no momento"
            })
        }
        
    }
    
    function setValuePrice(e){ 
        let  value:string  = e.target.value.toString();
        const inputMasked = maskPriceBr(value)
        setMask(inputMasked)
    }
    return (
        <div>
            <Header >
            <br/>
            <Container>
                <h1>Lance aqui o serviço feito</h1>
                <Form {...isFormSucess} loading={isLoading} onSubmit={insertService}> 
                    <Message {...formMessage}/>
                    <Form.Field>
                        <label>Nome do cliente</label>
                        <input placeholder='Digite o nome do cliente atendido' type={'text'} onChange={e=> setName(e.target.value)} value={name} required></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Nome do serviço</label>
                        <input placeholder='Digite o nome do serviço realizado' type={'text'} onChange={e=> setService(e.target.value)} value={service} required></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Valor cobrado</label>
                        <InputMask placeholder='Digite o valor cobrado' {...mask} onBlur={(e)=> setPrice(e.target.value)} onChange={e=> setValuePrice(e)} maskChar={null} />
                    </Form.Field>                 
                    <Form.Field>
                        <label>Data do serviço</label>
                        <input placeholder='Digite quando o serviço foi realizado' type={'date'}  onChange={e=> setDate(e.target.value)} value={serviceDate} required></input>
                    </Form.Field> 
                    <Button color='pink'>Inserir</Button>
                </Form>
            </Container>
            </Header>
            
        </div>
    )
}