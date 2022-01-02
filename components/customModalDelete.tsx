import { useReducer } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

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

function CustomModalDelete(props) {
  const [state, dispatch] = useReducer(reducer, {
    open: false,
  })
  const { open } = state

  return (
  
        <Modal
          onOpen={(e) =>
            dispatch({ event: e.type, name: 'onOpen', type: 'OPEN_MODAL' })
          }
          onClose={(e) =>
            dispatch({ event: e.type, name: 'onClose', type: 'CLOSE_MODAL' })
          }
          open={open}
          trigger={<Button icon color='red'><Icon name='delete'/></Button>}
        >
          <Modal.Header>Deletar este serviço?</Modal.Header>
          <Modal.Content>
            <p>Os dados não poderão ser recuperados caso prossiga!</p>
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
              negative
            >
              Não
            </Button>
            <Button
              onClick={(e) => {
                dispatch({
                  event: e.type,
                  name: 'onClick',
                  type: 'CLOSE_MODAL',
                })
                props.deleteService(props.id)
                }
              }
              positive
            >
              Sim
            </Button>
          </Modal.Actions>
        </Modal>
  )
}

export default CustomModalDelete