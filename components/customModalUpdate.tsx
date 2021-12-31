import { useEffect, useReducer, useState } from 'react'
import { Button, Container, Form, Icon, Modal } from 'semantic-ui-react'
import InputMask from 'react-input-mask'
import maskPriceBr from '../Utils/masks'
import moment from 'moment'
import { updateCurrentUser } from 'firebase/auth'
function reducer(state, action) {
  switch (action.type) {
    case 'CLEAR_LOG':
      return { ...state, log: [] }
    case 'OPEN_MODAL':
      return {
        open: true,
      }
    case 'CLOSE_MODAL':
      return {
        open: false,
      }
    default:
      throw new Error()
  }
}

function CustomModalUpdate(props) {
  const [state, dispatch] = useReducer(reducer, {
    open: false,
  })
    const { open } = state
    const [service, setService] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState('R$ 0,00')
    const [serviceDate, setDate] = useState("")
    const [mask, setMask] = useState({})
    useEffect(() => {
        setName(props.client)
        setPrice(props.price)
        setMask({value: 'R$ '+ price}) //value that will really apear on price field
        setService(props.service)
        setDate(moment(props.date).format('YYYY-MM-DD'))
    }, [props.client, props.price, props.service, props.date, price])
    
    function setValuePrice(e){ 
        let  value:string  = e.target.value.toString();
        const inputMasked = maskPriceBr(value)
        setMask(inputMasked)
    }
    function priceFormatDb(){
       return parseFloat(price.toString().replace('R$ ', '').replace(',','.'))
    }

    function update(){
        if(props.client != name || props.price.toString() != priceFormatDb().toString() || props.service != service || props.date != serviceDate  ){
            props.updateService(props.id, name,service,priceFormatDb(),serviceDate)
        }else{
            alert(props.client + '   '+ props.service)
        }
    }
  return (
  
        <Modal
          onOpen={(e) =>
            dispatch({ event: e.type, name: 'onOpen', type: 'OPEN_MODAL' })
          }
          onClose={(e) =>
            dispatch({ event: e.type, name: 'onClose', type: 'CLOSE_MODAL' })
          }
          open={open}
          trigger={<Button icon color='pink'><Icon name='edit'/></Button>}
        >
          <Modal.Header>Atualizar este Serviço?</Modal.Header>
          <Modal.Content>
            <p>Altere os dados e depois aperte no botão de salvar</p>
            <Container>
                <Form> 
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
                        <InputMask placeholder='Digite o valor cobrado' {...mask} onBlur={(e)=> setPrice(e.target.value)}  required onChange={e=> setValuePrice(e)} maskChar={null} />
                    </Form.Field>                 
                    <Form.Field>
                        <label>Data do serviço:</label>
                        <input placeholder='Digite quando o serviço foi realizado' type={'date'}  onChange={e=> setDate(e.target.value)} value={serviceDate} required></input>
                    </Form.Field> 
                </Form>
            </Container>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={(e) =>
                dispatch({
                  event: e.type,
                  name: 'onClick',
                  type: 'CLOSE_MODAL',
                })
              }
              
            >
              Cancelar
            </Button>
            <Button
              onClick={(e) => {
                dispatch({
                  event: e.type,
                  name: 'onClick',
                  type: 'CLOSE_MODAL',
                })
                update()
                }
              }
              color='pink'
            >
              Salvar
            </Button>
          </Modal.Actions>
        </Modal>
  )
}

export default CustomModalUpdate