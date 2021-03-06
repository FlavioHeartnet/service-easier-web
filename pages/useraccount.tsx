import HeaderMenu from './../components/header'
import {Container, Form, Button, Segment} from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../components/contexts/authContext'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import User from './../model/user'
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
    const {uid, auth, db, name,email, userSession, updateTitlePage} = useAuth()
    updateTitlePage("Sua Conta")
    const [id, setId] = useState("")
    const [isDisabled, setDisabled] = useState(true)
    const [nameState, setName] = useState(name)
    const [emailState, setEmail] = useState(email)
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
        const user = new User(uid,cpf,phone,comission,payday, null)
        let resp = {message:''}
        user.updateEmailInFirebase(auth,emailState)
        user.updateEmailInFirebase(auth, nameState)
        userSession(uid,nameState,emailState,comission,payday)
        if(id==""){
            resp = await user.insertUser()
        }else{
            resp = await user.updateUser(id)
        }
        if(resp.message == 'success'){
            handleEdit()
            setFormMessage({
                success: true,
                error:false,
                header:'Dados atualizados com sucesso! :)',
                content:'Fique tranquilo(a) caso n??o tenha aparecido os valores ?? so atualizar a pagina!',
                hidden: false
            })
        }else{
            console.log(resp.message)
            setFormMessage({
                success: false,
                error:true,
                header:'N??o foi possivel atualizar seus dados! :(',
                content:'Estamos trabalhando para melhorar nossos servi??os, tente novamente mais tarde!',
                hidden: false
            })
        }
        }else{
            setFormMessage({
                success: false,
                error:true,
                header:'N??o foi possivel atualizar seus dados! :(',
                content:'CPF informado ?? inv??lido!',
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
                content:'Sua senha esta atualiza e segura, parab??ns!!',
                hidden: false
            })
          }).catch((error) => {
              console.log(localizeErrorMap(error))
            setFormMessage({
                success: false,
                error:true,
                header:'N??o foi possivel atualizar sua senha! :(',
                content:localizeErrorMap(error),//'Estamos trabalhando para melhorar nossos servi??os, tente novamente mais tarde!',
                hidden: false
            })
          });
        }else{
            setFormMessage({
                success: false,
                error:true,
                header:'As senhas digitadas n??o batem :(',
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
    }, [db, uid])
    return (
        <div>
            <HeaderMenu>
                <p></p>
                <br/>
            <Container>
                <Button circular onClick={handleEdit} color='pink'>{editButtonState}</Button>
                <Messages {...formMessage}/>
                <Segment raised>
                <Form>
                    
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
                    <Form.Field>
                        <label>% da comiss??o</label>
                        <input value={comission} onChange={(e) => setComission(e.target.value)} disabled={isDisabled} type='number'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Periodo de recebimento</label>
                        <input value={payday} onChange={(e) => setPayday(e.target.value)} disabled={isDisabled} type='text'/>
                    </Form.Field>
                
                    <Button fluid disabled={isDisabled} type="button" onClick={updatePesonalData} color='pink'>Salvar</Button>
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
                        <Button fluid disabled={isDisabled} color='pink'>Alterar</Button>
                        </Form>
                    </Segment>
            </Container>
            </HeaderMenu>
            <br/>
        </div>
    )
}