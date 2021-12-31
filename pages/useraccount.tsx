import HeaderMenu from './../components/header'
import {Container, Form, Button, Segment, Dimmer, Message} from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../components/contexts/authContext'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import User from './../model/user'
import { db,auth } from '../firebase'
import { updatePassword } from 'firebase/auth'
import Messages from '../components/messages'
import localizeErrorMap from '../Utils/firebaseMessagesBr'
import validateCPF from '../Utils/validations'

export default function UserAccount(){
    const formInitialState = {
        success: true,
        error:false,
        header:'',
        content:'',
        hidden: true
    }
    const {uid} = useAuth()
    const [id, setId] = useState("")
    const [isDisabled, setDisabled] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confPassword, setConfPassword] = useState("")
    const [comission, setComission] = useState("")
    const [payday, setPayday] = useState("")
    const [formMessage, setFormMessage] = useState(formInitialState)
    const [editButtonState, setEditButton] = useState("Editar")

    function handleEdit(){
        if(editButtonState === 'Editar'){
            setEditButton("Desabilitar")
            setDisabled(false)
            
        }else{
            setEditButton("Editar")
            setDisabled(true)
        }
        setFormMessage(formInitialState)
    }

    async function updatePesonalData(){
        window.scrollTo(0, 0)
        if(validateCPF(cpf)){
        const user = new User(uid,name,email,cpf,phone,comission,payday, null)
        const resp = await user.updateUser(id)
        if(resp.message == 'success'){
            handleEdit()
            setFormMessage({
                success: true,
                error:false,
                header:'Dados atualizados com sucesso! :)',
                content:'Fique tranquilo(a) caso não tenha aparecido os valores é so atualizar a pagina!',
                hidden: false
            })
        }else{
            console.log(resp.message)
            setFormMessage({
                success: false,
                error:true,
                header:'Não foi possivel atualizar seus dados! :(',
                content:'Estamos trabalhando para melhorar nossos serviços, tente novamente mais tarde!',
                hidden: false
            })
        }
        }else{
            setFormMessage({
                success: false,
                error:true,
                header:'Não foi possivel atualizar seus dados! :(',
                content:'CPF informado é inválido!',
                hidden: false
            })
        }
    }
    function updateUserPassword(){
        
        if(password == confPassword){
        updatePassword(auth.currentUser, password).then(() => {
            handleEdit()
            setFormMessage({
                success: true,
                error:false,
                header:'Senha atualizada com sucesso! :)',
                content:'Sua senha esta atualiza e segura, parabéns!!',
                hidden: false
            })
          }).catch((error) => {
              console.log(localizeErrorMap(error))
            setFormMessage({
                success: false,
                error:true,
                header:'Não foi possivel atualizar sua senha! :(',
                content:localizeErrorMap(error),//'Estamos trabalhando para melhorar nossos serviços, tente novamente mais tarde!',
                hidden: false
            })
          });
        }else{
            setFormMessage({
                success: false,
                error:true,
                header:'As senhas digitadas não batem :(',
                content:'Por favor revise a senha informada, as mesma devem ser iguais!',
                hidden: false
            })
        }
    }
    useEffect(() => {
        const q = query(collection(db, User.COLLECTION_NAME), where("uid", "==", uid));
        const unsub = onSnapshot(q, (docs) => {
            docs.forEach((doc)=>{
                const user = doc.data()
                setId(doc.id)
                setName(user.name)
                setEmail(user.email)
                setCpf(user.cpf)
                setPhone(user.phone)
                setComission(user.comission)
                setPayday(user.payday)
            })
        });
        return unsub
    }, [uid])
    return (
        <div>
            <HeaderMenu>
            <Container>
                <h1>Sua Conta</h1>
                <Button onClick={handleEdit} color='pink'>{editButtonState}</Button>
                <Messages {...formMessage}/>
                <Segment raised>
                <Form onSubmit={updatePesonalData}>
                    
                    <Form.Field>
                        <label>Nome</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} disabled={isDisabled} type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label>E-mail</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={isDisabled} type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label>CPF</label>
                        <input value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={isDisabled} type='text'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Contato</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isDisabled} type='text'/>
                    </Form.Field>
                    
                    <Button disabled={isDisabled} color='pink'>Salvar</Button>
                </Form>
                </Segment>
                <Segment raised>
                    <h2>Alterar senha?</h2>
                        <Form onSubmit={updateUserPassword}>
                        <Form.Field>
                            <label>Nova Senha</label>
                            <input  onChange={(e) => setPassword(e.target.value)} disabled={isDisabled} type='password'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Confirmar Senha</label>
                            <input  onChange={(e) => setConfPassword(e.target.value)} disabled={isDisabled} type='password'/>
                        </Form.Field>
                        <Button disabled={isDisabled} color='pink'>Alterar</Button>
                        </Form>
                    </Segment>
                    <Segment raised>
                    <h2>Configuração de conta</h2>
                        <Form>
                        <Form.Field>
                            <label>% da comissão</label>
                            <input value={comission} onChange={(e) => setComission(e.target.value)} disabled={isDisabled} type='number'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Periodo de recebimento</label>
                            <input value={payday} onChange={(e) => setPayday(e.target.value)} disabled={isDisabled} type='text'/>
                        </Form.Field>
                        <Button disabled={isDisabled} onClick={updatePesonalData} color='pink'>Salvar</Button>
                        </Form>
                    </Segment>
            </Container>
            </HeaderMenu>
            <br/>
        </div>
    )
}