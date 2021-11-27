import Head from 'next/head'
import styles from '../styles/Login.module.scss'
import {Form, Button, Message, Segment} from 'semantic-ui-react'
import { useState } from 'react'
import {auth, GoogleProvider} from './../firebase'
import { signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {useRouter} from 'next/router'
import localizeErrorMap from './../Utils/firebaseMessagesBr'

export default function Login() {
  const router = useRouter()
  auth.useDeviceLanguage()

  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] =  useState("")
  const [password, setPassword] = useState("")
  const [isFormSucess, setFormSucess] = useState({})
  const [formMessage, setFormMessage] = useState({
      success: true,
      error:false,
      header:'',
      content:''
  })
  function loginGoogle(){
    signInWithPopup(auth, GoogleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      router.push('/home')
    }).catch((error) => {
      // Handle Errors here.
      const errorMessage = localizeErrorMap(error);
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      setFormSucess({
        error: true
    })
    setFormMessage({
        error: true,
        success:false,
        header: 'Não foi possivel logar :(',
        content: errorMessage
      })
      setLoading(false)
    });
  }
  function login(){
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    setLoading(false)
    const user = userCredential.user;
    router.push('/home')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = localizeErrorMap(error)
    

    setFormSucess({
      error: true
  })
  setFormMessage({
      error: true,
      success:false,
      header: 'Não foi possivel logar :(',
      content: errorMessage
    })
    setLoading(false)
  });
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroung}>
      <Head>
        <title>Organização de serviços prestados</title>
        <meta name="description" content="Aqui você pode organizar seus serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Segment raised>
        <h1 className={styles.title}>
          Service Easier <br/><a href="">Gestão de Serviços!</a>
        </h1>

        <p className={styles.description}>
          Faça seu login aqui!
        </p>  
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
      <div className={styles.buttons}>
        <Button loading={isLoading} primary>Entrar</Button>
        <Button type={'button'} color='red' onClick={loginGoogle}>Entrar com Google</Button>
        <Button type={'button'}>Não tem acesso? cadastre-se</Button>
      </div>
      </Form>
      </Segment>
      </main>

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
