import HeaderMenu from './../components/header'
import {Container, Form, Button, Segment, Dimmer, Icon, Header} from 'semantic-ui-react'
export default function UserAccount(){
    return (
        <div>
            <HeaderMenu>
            <Container>
                <h1>Sua Conta</h1>
                <Button color='pink'>Editar</Button>
                <Segment raised>
                <Form>
                    <Form.Field>
                        <label>Nome</label>
                        <input value='Derliane' disabled type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label>E-mail</label>
                        <input value='derteste@gmail.com' disabled type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label>CPF</label>
                        <input value='129.888.888-88' disabled type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Contato</label>
                        <input value='(12) 98888-8888' disabled type='text'/>
                    </Form.Field>
                    
                    <Button color='pink'>Salvar</Button>
                </Form>
                </Segment>
                <Segment raised>
                    <h2>Alterar senha?</h2>
                        <Form>
                        <Form.Field>
                            <label>Senha</label>
                            <input value='(12) 98888-8888' disabled type='password'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Confirmar Senha</label>
                            <input value='(12) 98888-8888' disabled type='password'/>
                        </Form.Field>
                        <Button color='pink'>Alterar</Button>
                        </Form>
                    </Segment>
                    <Segment raised>
                    <h2>Configuração de conta</h2>
                        <Form>
                        <Form.Field>
                            <label>% da comissão</label>
                            <input value='50' disabled type='text'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Periodo de recebimento</label>
                            <input value='todo dia 15 e ultimo dia útil do mês' disabled type='text'/>
                        </Form.Field>
                        <Button color='pink'>Alterar</Button>
                        </Form>
                    </Segment>
            </Container>
            </HeaderMenu>
            
            <br/>
        </div>
    )
}