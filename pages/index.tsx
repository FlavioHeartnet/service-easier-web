import Head from 'next/head'
import styles from '../styles/Login.module.scss'
import {Form, Button, Message, Segment, Container} from 'semantic-ui-react'
import { useState } from 'react'
import { signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import {useRouter} from 'next/router'
import localizeErrorMap from './../Utils/firebaseMessagesBr'
import Messages from '../components/messages'
import { useAuth } from '../components/contexts/authContext';

  
export default function Login() {
  const {auth} = useAuth()
  auth.useDeviceLanguage()
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] =  useState("")
  const [password, setPassword] = useState("")
  const [isFormSucess, setFormSucess] = useState({})
  const [formMessage, setFormMessage] = useState({
      success: true,
      error:false,
      header:'',
      content:'',
      hidden: true
  })
  function loginGoogle(){
    signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      router.push('/home')
    }).catch((error) => {
      // Handle Errors here.
      const errorMessage = localizeErrorMap(error);
      setFormSucess({
        error: true
    })
    setFormMessage({
        error: true,
        success:false,
        header: 'Não foi possivel logar :(',
        content: errorMessage,
        hidden:false
      })
      setLoading(false)
    });
  }
  function login(){
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
  .then(() => {
    setLoading(false)
    router.push('/home')
  })
  .catch((error) => {
    const errorMessage = localizeErrorMap(error)
    setFormSucess({
      error: true
  })
  setFormMessage({
      error: true,
      success:false,
      header: 'Não foi possivel logar :(',
      content: errorMessage,
      hidden:false
    })
    setLoading(false)
  });
  }

  function forgotPassword(){
    if(email === ''){
      setFormMessage({
          error: true,
          success:false,
          header: 'E-mail não pode estar em branco :(',
          content: 'Digite seu email no campo e-mail!!',
          hidden:false
        })
    }else{
      sendPasswordResetEmail(auth, email)
      .then(() => {
        setFormMessage({
            error: false,
            success:true,
            header: 'E-mail enviado ;)',
            content: 'Foi enviado um email a sua caixa de entrada com as instruções para sua senha',
            hidden:false
          })
          
      })
      .catch((error) => {
      setFormMessage({
          error: true,
          success:false,
          header: 'Não foi possivel resetar a senha :(',
          content: 'Estamos trabalhando para corrigir isso, tente novamente mais tarde!',
          hidden:false
        })
        
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroung}>
      <Head>
        <title>Organização de serviços prestados</title>
        <meta name="description" content="Aqui você pode organizar seus serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Segment>
      <main className={styles.main}>
        
        <h1 className={styles.title}>
          Service Easier <br/><a style={{color: '#e03997'}} href="">Gestão de Serviços!</a>
        </h1>

        <p className={styles.description}>
          Faça seu login aqui!
        </p> 
        <Messages {...formMessage}/>
      <Form onSubmit={login} {...isFormSucess}>
      <Message
                    {...formMessage}          
                /> 
      <Form.Field>
          <label>E-mail</label>
          <input placeholder={'Digite seu email'} required onChange={(e)=> setEmail(e.target.value)} type='email' />
      </Form.Field>
      <Form.Field>
          <label>Senha</label>
          <input placeholder={'Digite sua senha'} required onChange={(e)=> setPassword(e.target.value)} type='password' />
      </Form.Field>
      <br/>
      <Container fluid>
        <Button fluid loading={isLoading} color='pink'>Entrar</Button><br/>
        <Button fluid type={'button'} color='red' onClick={loginGoogle}>Entrar com Google</Button><br/>
        <Button fluid onClick={()=> router.push('/signup')} type={'button'}>Não tem acesso?</Button><br/>
        <Button fluid basic onClick={forgotPassword} type={'button'}>Esqueceu a senha?</Button><br/>
      </Container>
      </Form>
      
      </main>
      </Segment>
      </Container>
      <footer className={styles.footer}>
        <a
          href="https://portifolio-284f2.web.app/#home"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by {' '}
          
            Flavio Nogueira
          
        </a>
      </footer>
      </div>
    </div>
  )
}
