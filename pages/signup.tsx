import { useState } from 'react'
import { useRouter } from 'next/router'
import {Form, Button, Message} from 'semantic-ui-react'
import styles from './../styles/signup.module.scss'
import { createUserWithEmailAndPassword , sendEmailVerification} from "firebase/auth";
import {auth} from './../firebase'
import User from '../model/user';
import localizeErrorMap from './../Utils/firebaseMessagesBr'

export default function Signup(){
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [isFormSucess, setFormSucess] = useState({})
    const [formMessage, setFormMessage] = useState({
        success: true,
        error:false,
        header:'',
        content:''
    })

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [senha, setSenha] = useState("")
    const [confsenha, setConfsenha] = useState("")
    const [tel, setTel] = useState("")

    const checkPassword = ():boolean=>{
        if(senha === confsenha){
            return true
        }else{ 
            return false
        }
    }
    const signin = ()=>{
        setLoading(true)
        if(checkPassword()){
            createUserWithEmailAndPassword(auth, email, senha)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    console.log(user)
                    const token = user.uid
                    const newUser = new User(token,nome,email,cpf,tel)
                    newUser.insertUser()
                        setLoading(false)
                        setFormSucess({success: true}) 
                        setFormMessage({
                            success: true,
                            error: false,
                            header:'Cadastro Concluido',
                            content:"Agora você pode logar no nosso sistema, lembre-se de validar sua conta, enviamos um email para isso!! :)"
                        })

                        sendEmailVerification(auth.currentUser)
                        .then(() => {
                        });
                })
                .catch((error) => {
                    setLoading(false)
                    setFormSucess({
                        error: true
                    })
                    setFormMessage({
                        error: true,
                        success:false,
                        header: 'Não foi possivel concluir o cadastro :(',
                        content: localizeErrorMap(error)
                      })
                });               
        }else{
            setLoading(false)
            setFormSucess({
                error: true
            })
            setFormMessage({
                error: true,
                success:false,
                header: 'Não foi possivel concluir o cadastro :(',
                content: 'As senhas não conferem por favor digite novamente'
              })
        }
    }

   
    return (
        <div className={styles.container}>            
            <Form onSubmit={signin} {...isFormSucess}>
            <h1>Cadastre-se ;)</h1>
                <Message
                    {...formMessage}          
                />
                <Form.Field>
                    <label>Nome</label>
                    <input required onChange={e => setNome(e.target.value)} type='text' placeholder='Digite seu nome'/>
                </Form.Field>
                <Form.Field>
                    <label>E-mail</label>
                    <input required onChange={e => setEmail(e.target.value)} type='email' placeholder='Digite seu email'/>
                </Form.Field>
                <Form.Field>
                    <label>CPF</label>
                    <input required onChange={e => setCpf(e.target.value)} type='text' placeholder='Digite seu CPF'/>
                </Form.Field>
                <Form.Field>
                    <label>Telefone/celular</label>
                    <input required onChange={e => setTel(e.target.value)} type='text' placeholder='Digite seu telefone'/>
                </Form.Field>
                <Form.Group>
                    <Form.Field>
                        <label>Senha</label>
                        <input required onChange={e => setSenha(e.target.value)} type='password' placeholder='Digite sua senha'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Confirme sua senha</label>
                        <input required onChange={e => setConfsenha(e.target.value)} type='password' placeholder='Digite novamente sua senha'/>
                    </Form.Field>
                </Form.Group>
                <div className= {styles.buttons}>
                    <Button color='pink' loading={isLoading}>Cadastrar</Button>
                    <Button type={'button'} onClick={() => router.push('/')}>Voltar</Button>
                </div>  
            </Form>
            
        </div>
    )
}